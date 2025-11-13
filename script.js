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
  ],
  BBL: [
    { name: 'Glenn Maxwell', rarity: 'mythic', image: '' },
    { name: 'Rashid Khan', rarity: 'legendary', image: '' },
    { name: 'Shaun Marsh', rarity: 'epic', image: '' },
    { name: 'Josh Inglis', rarity: 'rare', image: '' },
    { name: 'Daniel Sams', rarity: 'common', image: '' }
  ],
  Aust: [
    { name: 'Scott Boland', rarity: 'mythic', image: '' },
    { name: 'Pat Cummins', rarity: 'legendary', image: '' },
    { name: 'Matt Renshaw', rarity: 'epic', image: '' },
    { name: 'Cooper Connolly', rarity: 'rare', image: '' },
    { name: 'Nathan Lyon', rarity: 'common', image: '' }
  ]
};

const rarityWeights = { mythic: 0.01, legendary: 0.04, epic: 0.10, rare: 0.35, common: 0.50 };
const raritySell = { mythic: 1000, legendary: 500, epic: 250, rare: 100, common: 25 };
let players = JSON.parse(JSON.stringify(basePlayers));
let coins = 600;
let inventory = [];
let lastDailyClaim = null;
const dailyRewardAmount = 100;

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
  let pool = [];
  if (sport==='mixed'){
    for (const s in players) pool = pool.concat(players[s].map(p => ({ ...p, sport:s })));
  } else pool = players[sport].map(p => ({...p,sport}));
  const targetRarity = chooseRarity();
  let candidates = pool.filter(p=>p.rarity===targetRarity);
  if(candidates.length===0) candidates = pool;
  const i = Math.floor(Math.random()*candidates.length);
  return candidates[i];
}

// --------------------------
// DOM elements
// --------------------------
const caseInner = document.getElementById('caseInner');
const caseVisual = document.getElementById('caseVisual');
const resultArea = document.getElementById('resultArea');
const openBtn = document.getElementById('openBtn');
const open5Btn = document.getElementById('open5Btn');
const dailyRewardBtn = document.getElementById('dailyRewardBtn');
const resetBtn = document.getElementById('resetBtn');
const coinsDisplay = document.getElementById('coinsDisplay');
const sportSelect = document.getElementById('sportSelect');
const inventoryList = document.getElementById('inventoryList');
const sellAllBtn = document.getElementById('sellAllBtn');

// --------------------------
// UI functions
// --------------------------
function updateCoinsDisplay(){coinsDisplay.textContent=`Coins: ${coins}`;}

function makeCard(p){
  const el = document.createElement('div');
  el.className='player-card';
  const avatarContent = p.image ? `<img src='${p.image}' alt='${p.name}'>` : p.name.split(' ').slice(0,2).map(n=>n[0]).join('');
  el.innerHTML=`<div class='avatar'>${avatarContent}</div>
  <div class='meta'>
    <h3>${p.name}</h3>
    <p>${p.sport} • <span class='rarity ${p.rarity}'>${p.rarity.toUpperCase()}</span></p>
    <p>Sell: ${raritySell[p.rarity]} coins</p>
  </div>`;
  el.addEventListener('click',()=>{p.fav=!p.fav;el.classList.toggle('fav',p.fav);});
  return el;
}

function updateInventoryDisplay(){
  inventoryList.innerHTML='';
  inventory.forEach(p=>inventoryList.appendChild(makeCard(p)));
}

function spawnConfetti(){
  const c = document.createElement('div'); c.className='confetti';
  caseVisual.appendChild(c);
  for(let i=0;i<18;i++){
    const piece=document.createElement('div');
    piece.style.position='absolute';
    piece.style.left=(50+(Math.random()*240-120))+'px';
    piece.style.top=(40+Math.random()*80)+'px';
    piece.style.width='8px';
    piece.style.height='8px';
    piece.style.opacity='0.95';
    piece.style.borderRadius='2px';
    piece.style.transform=`rotate(${Math.random()*360}deg)`;
    piece.style.background=(i%4===0)?'var(--gold)':'var(--accent)';
    piece.animate([{transform:`translateY(0) rotate(${Math.random()*200}deg)`,opacity:1},{transform:`translateY(${120+Math.random()*200}px) rotate(${Math.random()*800}deg)`,opacity:0}],{duration:900+Math.random()*700,iterations:1,easing:'cubic-bezier(.2,.7,.2,1)'});
    c.appendChild(piece);
  }
  setTimeout(()=>c.remove(),1600);
}

// --------------------------
// Case logic
// --------------------------
function animateOpen(sport,count=1){
  if(coins<count*100){alert('Not enough coins!'); return;}
  coins-=count*100; updateCoinsDisplay();
  caseInner.innerHTML='';
  for(let i=0;i<12;i++) caseInner.appendChild(makeCard({name:'?',sport:'',rarity:'common'}));
  let results=[];
  for(let i=0;i<count;i++) results.push(pickOne(sport));
  setTimeout(()=>{
    caseInner.innerHTML='';
    results.forEach(p=>{
      inventory.push({...p});
      caseInner.appendChild(makeCard(p));
    });
    updateInventoryDisplay();
    showResult(results[0]);
  },900);
}

function showResult(p){resultArea.innerHTML=''; const wrapper=document.createElement('div'); wrapper.className='big-card';
  const avatarContent=p.image?`<img src='${p.image}' alt='${p.name}' style='width:100px;height:100px;object-fit:cover;border-radius:50%;'>`:p.name.split(' ').slice(0,2).map(n=>n[0]).join('');
  wrapper.innerHTML=`<div>${avatarContent}</div><div style='font-size:16px;font-weight:800;margin-top:8px'>${p.name}</div><div style='margin-top:6px;color:var(--muted)'>${p.sport}</div><div style='margin-top:10px'><span class='rarity ${p.rarity}'>${p.rarity.toUpperCase()}</span></div>`;
  resultArea.appendChild(wrapper); spawnConfetti();
}

// --------------------------
// Daily reward
// --------------------------
function claimDailyReward(){
  const today = new Date().toDateString();
  if(lastDailyClaim===today){alert("Already claimed today!"); return;}
  coins+=dailyRewardAmount;
  lastDailyClaim=today;
  updateCoinsDisplay();
  alert(`Daily reward claimed! +${dailyRewardAmount} coins`);
}

// --------------------------
// Sell inventory
// --------------------------
sellAllBtn.addEventListener('click',()=>{
  let total=0;
  inventory=inventory.filter(p=>{
    if(p.fav) return true;
    total+=raritySell[p.rarity]||0;
    return false;
  });
  coins+=total; updateCoinsDisplay(); updateInventoryDisplay();
  alert(`Sold all non-favourites for ${total} coins`);
});

// --------------------------
// Event listeners
// --------------------------
openBtn.addEventListener('click',()=>animateOpen(sportSelect.value,1));
open5Btn.addEventListener('click',()=>animateOpen(sportSelect.value,5));
dailyRewardBtn.addEventListener('click',claimDailyReward);
resetBtn.addEventListener('click',()=>{
  inventory=[]; coins=600; players=JSON.parse(JSON.stringify(basePlayers)); lastDailyClaim=null;
  caseInner.innerHTML='No pulls yet'; resultArea.innerHTML=''; updateCoinsDisplay(); updateInventoryDisplay();
  alert('Game reset! Daily reward is available again.');
});

// --------------------------
// Initial display
// --------------------------
updateCoinsDisplay(); updateInventoryDisplay();
