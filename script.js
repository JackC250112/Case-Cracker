document.addEventListener('DOMContentLoaded', () => {

const rarityWeights = { mythic: 0.01, legendary: 0.04, epic: 0.10, rare: 0.35, common: 0.50 };
const sellValues = { mythic: 1000, legendary: 500, epic: 250, rare: 100, common: 25 };
let coins = 600;

const basePlayers = {
  NBA: [
    { name: 'LeBron James', rarity: 'legendary', image: 'https://nba-players-images.s3.amazonaws.com/lebron.jpg' },
    { name: 'Stephen Curry', rarity: 'epic', image: 'https://nba-players-images.s3.amazonaws.com/curry.jpg' },
    { name: 'Joel Embiid', rarity: 'epic', image: 'https://nba-players-images.s3.amazonaws.com/embiid.jpg' },
    { name: 'Luka Doncic', rarity: 'rare', image: 'https://nba-players-images.s3.amazonaws.com/doncic.jpg' },
    { name: 'Jayson Tatum', rarity: 'rare', image: 'https://nba-players-images.s3.amazonaws.com/tatum.jpg' },
    { name: 'Victor Wembanyama', rarity: 'mythic', image: 'https://nba-players-images.s3.amazonaws.com/wembanyama.jpg' },
    { name: 'LaMelo Ball', rarity: 'epic', image: 'https://nba-players-images.s3.amazonaws.com/lamelo.jpg' }
  ],
  NBL: [
    { name: 'Bryce Cotton', rarity: 'mythic', image: '' },
    { name: 'Tyler Harvey', rarity: 'epic', image: '' },
    { name: 'Chris Goulding', rarity: 'rare', image: '' },
    { name: 'Nathan Sobey', rarity: 'common', image: '' },
    { name: 'Admiral Schofield', rarity: 'common', image: '' },
    { name: 'Jaylen Adams', rarity: 'common', image: '' },
    { name: 'Jack McVeigh', rarity: 'common', image: '' }
  ],
  AFL: [
    { name: 'Dustin Martin', rarity: 'mythic', image: '' },
    { name: 'Nat Fyfe', rarity: 'rare', image: '' },
    { name: 'Patrick Voss', rarity: 'epic', image: '' },
    { name: 'Marcus Bontempelli', rarity: 'epic', image: '' },
    { name: 'Nick Daicos', rarity: 'rare', image: '' },
    { name: 'Lachie Neale', rarity: 'rare', image: '' },
    { name: 'Murphy Reid', rarity: 'rare', image: '' }
  ],
  Soccer: [
    { name: 'Erling Haaland', rarity: 'mythic', image: '' },
    { name: 'Mohamed Salah', rarity: 'epic', image: '' },
    { name: 'Kevin De Bruyne', rarity: 'epic', image: '' },
    { name: 'Martin Ødegaard', rarity: 'epic', image: '' },
    { name: 'Allison Becker', rarity: 'rare', image: '' },
    { name: 'Virgil Van Dijk', rarity: 'rare', image: '' },
    { name: 'Son Heung-min', rarity: 'rare', image: '' }
  ],
  BBL: [
    { name: 'Glenn Maxwell', rarity: 'epic', image: '' },
    { name: 'Rashid Khan', rarity: 'epic', image: '' },
    { name: 'Shaun Marsh', rarity: 'rare', image: '' },
    { name: 'Josh Inglis', rarity: 'rare', image: '' },
    { name: 'Daniel Sams', rarity: 'common', image: '' },
    { name: 'James Vince', rarity: 'common', image: '' },
    { name: 'Chris Lynn', rarity: 'common', image: '' }
  ],
  AusCricket: [
    { name: 'Scott Boland', rarity: 'epic', image: '' },
    { name: 'Pat Cummins', rarity: 'mythic', image: '' },
    { name: 'Matt Renshaw', rarity: 'rare', image: '' },
    { name: 'Cooper Connolly', rarity: 'common', image: '' },
    { name: 'Nathan Lyon', rarity: 'epic', image: '' },
    { name: 'Travis Head', rarity: 'rare', image: '' },
    { name: 'Mitch Marsh', rarity: 'rare', image: '' }
  ]
};

let players = JSON.parse(JSON.stringify(basePlayers));
let inventory = [];

const caseInner = document.getElementById('caseInner');
const caseVisual = document.getElementById('caseVisual');
const resultArea = document.getElementById('resultArea');
const openBtn = document.getElementById('openBtn');
const open5Btn = document.getElementById('open5Btn');
const dailyBtn = document.getElementById('dailyBtn');
const sportSelect = document.getElementById('sportSelect');
const customPlayers = document.getElementById('customPlayers');
const importBtn = document.getElementById('importBtn');
const resetBtn = document.getElementById('resetBtn');
const coinsDisplay = document.getElementById('coinsDisplay');
const inventoryList = document.getElementById('inventoryList');
const sellAllBtn = document.getElementById('sellAllBtn');

// Utility functions
function chooseRarity() {
  const r = Math.random();
  let sum = 0;
  for (const k of ['mythic','legendary','epic','rare','common']) {
    sum += rarityWeights[k];
    if (r <= sum) return k;
  }
  return 'common';
}

function pickOne(sport) {
  let pool = sport==='mixed'? [].concat(...Object.values(players)) : players[sport];
  const targetRarity = chooseRarity();
  let candidates = pool.filter(p=>p.rarity===targetRarity);
  if(candidates.length===0) candidates=pool;
  return {...candidates[Math.floor(Math.random()*candidates.length)], sport};
}

function makeCard(p) {
  const el = document.createElement('div');
  el.className='player-card';
  const avatarContent = p.image ? `<img src='${p.image}' alt='${p.name}'>` : p.name.split(' ').map(n=>n[0]).join('');
  el.innerHTML=`<div class='avatar'>${avatarContent}</div>
                <div class='meta'>
                  <h3>${p.name}</h3>
                  <p>${p.sport} • <span class='rarity ${p.rarity}'>${p.rarity.toUpperCase()}</span></p>
                </div>`;
  return el;
}

function showResult(p) {
  resultArea.innerHTML='';
  resultArea.appendChild(makeCard(p));
  addToInventory(p);
  spawnConfetti();
}

function spawnConfetti() {
  const c = document.createElement('div'); c.className='confetti'; caseVisual.appendChild(c);
  for(let i=0;i<18;i++){
    const piece=document.createElement('div');
    piece.style.position='absolute';
    piece.style.left=(50+(Math.random()*240-120))+'px';
    piece.style.top=(40+Math.random()*80)+'px';
    piece.style.width='8px'; piece.style.height='8px'; piece.style.opacity='0.95';
    piece.style.borderRadius='2px'; piece.style.transform=`rotate(${Math.random()*360}deg)`;
    piece.style.background=i%4===0?'var(--gold)':'var(--accent)';
    piece.animate([{transform:`translateY(0) rotate(${Math.random()*200}deg)`,opacity:1},
                   {transform:`translateY(${120+Math.random()*200}px) rotate(${Math.random()*800}deg)`,opacity:0}],
                  {duration:900+Math.random()*700,iterations:1,easing:'cubic-bezier(.2,.7,.2,1)'}); c.appendChild(piece);
  }
  setTimeout(()=>{c.remove();},1600);
}

function addToInventory(p){
  const invItem={...p,favorite:false}; inventory.push(invItem); renderInventory();
}

function renderInventory(){
  inventoryList.innerHTML='';
  inventory.forEach((p,i)=>{
    const el=document.createElement('div'); el.className='player-card';
    el.innerHTML=`${p.name} (${p.rarity}) <button data-i='${i}'>${p.favorite?'Unfav':'Fav'}</button>`;
    const btn=el.querySelector('button'); btn.addEventListener('click',()=>{
      inventory[i].favorite=!inventory[i].favorite;
      renderInventory();
    });
    inventoryList.appendChild(el);
  });
}

function sellAll(){
  let earned=0;
  inventory=inventory.filter(p=>{
    if(p.favorite) return true;
    earned+=sellValues[p.rarity]||0;
    return false;
  });
  coins+=earned; coinsDisplay.textContent=`Coins: ${coins}`; renderInventory();
  alert(`Sold all non-favorites for ${earned} coins!`);
}

// Events
openBtn.addEventListener('click',()=>{
  if(coins<100){alert("Not enough coins!");return;}
  coins-=100; coinsDisplay.textContent=`Coins: ${coins}`;
  const p=pickOne(sportSelect.value);
  showResult(p);
});
open5Btn.addEventListener('click',()=>{
  if(coins<500){alert("Not enough coins!");return;}
  coins-=500; coinsDisplay.textContent=`Coins: ${coins}`;
  const results=[...Array(5)].map(()=>pickOne(sportSelect.value));
  results.forEach(r=>showResult(r));
});
sellAllBtn.addEventListener('click',sellAll);
importBtn.addEventListener('click',()=>{
  const lines=customPlayers.value.split('\n').map(l=>l.trim()).filter(l=>l);
  for(const line of lines){
    const [sport,name,image]=line.split(':');
    if(sport&&name){
      if(!players[sport]) players[sport]=[];
      players[sport].push({name,image:image||'',rarity:'common'});
    }
  }
  alert('Custom players imported!');
});
resetBtn.addEventListener('click',()=>{
  players=JSON.parse(JSON.stringify(basePlayers)); inventory=[]; renderInventory(); alert('Players reset!');
});
dailyBtn.addEventListener('click',()=>{
  coins+=200; coinsDisplay.textContent=`Coins: ${coins}`; alert('Daily reward: 200 coins!');
});

});
