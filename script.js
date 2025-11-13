// --------------------------
// Base player data
// --------------------------
const basePlayers = {
  NBA: [
    { name: 'LeBron James', rarity: 'mythic', image: 'https://nba-players-images.s3.amazonaws.com/lebron.jpg' },
    { name: 'Stephen Curry', rarity: 'legendary', image: 'https://nba-players-images.s3.amazonaws.com/curry.jpg' },
    { name: 'Joel Embiid', rarity: 'epic', image: 'https://nba-players-images.s3.amazonaws.com/embiid.jpg' },
    { name: 'Luka Doncic', rarity: 'rare', image: 'https://nba-players-images.s3.amazonaws.com/doncic.jpg' },
    { name: 'Jayson Tatum', rarity: 'common', image: 'https://nba-players-images.s3.amazonaws.com/tatum.jpg' }
  ],
  NBL: [
    { name: 'Bryce Cotton', rarity: 'mythic', image: '' },
    { name: 'Tyler Harvey', rarity: 'legendary', image: '' },
    { name: 'Chris Goulding', rarity: 'epic', image: '' },
    { name: 'Nathan Sobey', rarity: 'rare', image: '' },
    { name: 'Admiral Schofield', rarity: 'common', image: '' }
  ],
  AFL: [
    { name: 'Dustin Martin', rarity: 'mythic', image: '' },
    { name: 'Nat Fyfe', rarity: 'legendary', image: '' },
    { name: 'Patrick Voss', rarity: 'epic', image: '' },
    { name: 'Marcus Bontempelli', rarity: 'rare', image: '' },
    { name: 'Nick Daicos', rarity: 'common', image: '' }
  ],
  Soccer: [
    { name: 'Erling Haaland', rarity: 'mythic', image: '' },
    { name: 'Mohamed Salah', rarity: 'legendary', image: '' },
    { name: 'Kevin De Bruyne', rarity: 'epic', image: '' },
    { name: 'Martin Ødegaard', rarity: 'rare', image: '' },
    { name: 'Son Heung-min', rarity: 'common', image: '' }
  ]
};

const rarityWeights = {
  mythic: 0.01,
  legendary: 0.04,
  epic: 0.10,
  rare: 0.35,
  common: 0.50
};

const sellValues = {
  mythic: 1000,
  legendary: 500,
  epic: 250,
  rare: 100,
  common: 25
};

let players = JSON.parse(JSON.stringify(basePlayers));
let coins = 600;
let inventory = [];

// --------------------------
// DOM elements
// --------------------------
const caseInner = document.getElementById('caseInner');
const caseVisual = document.getElementById('caseVisual');
const resultArea = document.getElementById('resultArea');
const openBtn = document.getElementById('openBtn');
const open5Btn = document.getElementById('open5Btn');
const sportSelect = document.getElementById('sportSelect');
const delayInput = document.getElementById('delayInput');
const customPlayers = document.getElementById('customPlayers');
const importBtn = document.getElementById('importBtn');
const resetBtn = document.getElementById('resetBtn');
const coinDisplay = document.getElementById('coinDisplay');
const inventoryArea = document.getElementById('inventoryArea');
const sellAllBtn = document.getElementById('sellAllBtn');
const dailyBtn = document.getElementById('dailyBtn');

// --------------------------
// Utility functions
// --------------------------
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
  const pool = players[sport].map(p => ({ ...p, sport }));
  const targetRarity = chooseRarity();
  let candidates = pool.filter(p => p.rarity === targetRarity);
  if (candidates.length === 0) candidates = pool;
  const i = Math.floor(Math.random() * candidates.length);
  return candidates[i];
}

function makeCard(p) {
  const el = document.createElement('div');
  el.className = 'player-card';
  const avatarContent = p.image ? `<img src='${p.image}' alt='${p.name}'>` : p.name.split(' ').slice(0,2).map(n => n[0]).join('');
  el.innerHTML = `<div class='avatar'>${avatarContent}</div>
                  <div class='meta'>
                    <h3>${p.name}</h3>
                    <p>${p.sport} • <span class='rarity ${p.rarity}'>${p.rarity.toUpperCase()}</span></p>
                    <p>Sell: ${sellValues[p.rarity]} coins</p>
                    <button class="favBtn">${p.fav ? '★' : '☆'}</button>
                  </div>`;
  const favBtn = el.querySelector('.favBtn');
  favBtn.addEventListener('click', () => {
    p.fav = !p.fav;
    favBtn.textContent = p.fav ? '★' : '☆';
  });
  return el;
}

function showResult(p) {
  resultArea.innerHTML = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'big-card';
  const avatarContent = p.image ? `<img src='${p.image}' alt='${p.name}' style='width:100px;height:100px;object-fit:cover;border-radius:50%;'>` :
    p.name.split(' ').slice(0,2).map(n => n[0]).join('');
  wrapper.innerHTML = `<div>${avatarContent}</div>
                       <div style='font-size:16px;font-weight:800;margin-top:8px'>${p.name}</div>
                       <div style='margin-top:6px;color:var(--muted)'>${p.sport}</div>
                       <div style='margin-top:10px'>
                         <span class='rarity ${p.rarity}'>${p.rarity.toUpperCase()}</span>
                       </div>`;
  resultArea.appendChild(wrapper);
  inventory.push(p);
  spawnConfetti();
  updateInventory();
}

function spawnConfetti() {
  const c = document.createElement('div');
  c.className = 'confetti';
  caseVisual.appendChild(c);
  for (let i = 0; i < 18; i++) {
    const piece = document.createElement('div');
    piece.style.position = 'absolute';
    piece.style.left = (50 + (Math.random() * 240 - 120)) + 'px';
    piece.style.top = (40 + Math.random() * 80) + 'px';
    piece.style.width = '8px';
    piece.style.height = '8px';
    piece.style.opacity = '0.95';
    piece.style.borderRadius = '2px';
    piece.style.transform = `rotate(${Math.random()*360}deg)`;
    piece.style.background = (i%4===0)?'var(--gold)':'var(--accent)';
    piece.animate([{transform:`translateY(0) rotate(${Math.random()*200}deg)`,opacity:1},
                   {transform:`translateY(${120+Math.random()*200}px) rotate(${Math.random()*800}deg)`,opacity:0}],
                   {duration:900+Math.random()*700,iterations:1,easing:'cubic-bezier(.2,.7,.2,1)'});
    c.appendChild(piece);
  }
  setTimeout(()=>{c.remove();},1600);
}

// --------------------------
// Inventory
// --------------------------
function updateInventory() {
  inventoryArea.innerHTML = '';
  inventory.forEach((p, idx) => {
    const el = makeCard(p);
    inventoryArea.appendChild(el);
  });
}

// --------------------------
// Pack opening
// --------------------------
async function animateOpen(count=1) {
  if (coins < 100*count) {
    alert('Not enough coins!');
    return;
  }
  coins -= 100*count;
  coinDisplay.textContent = coins;

  caseInner.innerHTML = '';
  for (let i=0;i<12;i++){
    caseInner.appendChild(makeCard({name:'?',sport:'',rarity:'common'}));
  }

  const results = [];
  for (let i=0;i<count;i++){
    results.push(pickOne(sportSelect.value));
  }

  setTimeout(()=>{
    caseInner.innerHTML='';
    results.forEach(r=>caseInner.appendChild(makeCard(r)));
    showResult(results[0]);
  },900);
}

// --------------------------
// Event listeners
// --------------------------
openBtn.addEventListener('click',()=>animateOpen(1));
open5Btn.addEventListener('click',()=>animateOpen(5));

importBtn.addEventListener('click',()=>{
  const lines = customPlayers.value.split('\n').map(l=>l.trim()).filter(l=>l);
  for(const line of lines){
    const [sport,name,image]=line.split(':');
    if(sport && name){
      if(!players[sport]) players[sport]=[];
      players[sport].push({name,image:image||'',rarity:'common'});
    }
  }
  alert('Custom players imported!');
});

resetBtn.addEventListener('click',()=>{
  players = JSON.parse(JSON.stringify(basePlayers));
  inventory=[];
  customPlayers.value='';
  coins=600;
  coinDisplay.textContent=coins;
  updateInventory();
  alert('Players reset to defaults.');
});

// Sell all
sellAllBtn.addEventListener('click',()=>{
  let total=0;
  const toKeep=[];
  inventory.forEach(p=>{
    if(p.fav) toKeep.push(p);
    else total+=sellValues[p.rarity];
  });
  inventory=toKeep;
  coins+=total;
  coinDisplay.textContent=coins;
  updateInventory();
});

// Daily reward
dailyBtn.addEventListener('click',()=>{
  const today=new Date().toDateString();
  const lastClaim=localStorage.getItem('lastDailyClaim');
  if(lastClaim===today){alert("You've already claimed today's daily reward!");return;}
  coins+=200;
  coinDisplay.textContent=coins;
  localStorage.setItem('lastDailyClaim',today);
  alert('Daily reward +200 coins!');
});

// Initialize
coinDisplay.textContent=coins;
updateInventory();
