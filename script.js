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
    { name: 'Admiral Schofield', rarity: 'common', image: '' },
    { name: 'Jaylen Adams', rarity: 'common', image: '' },
    { name: 'Jack McVeigh', rarity: 'common', image: '' }
  ],
  AFL: [
    { name: 'Dustin Martin', rarity: 'mythic', image: '' },
    { name: 'Nat Fyfe', rarity: 'legendary', image: '' },
    { name: 'Patrick Voss', rarity: 'epic', image: '' },
    { name: 'Marcus Bontempelli', rarity: 'epic', image: '' },
    { name: 'Nick Daicos', rarity: 'rare', image: '' },
    { name: 'Lachie Neale', rarity: 'rare', image: '' },
    { name: 'Murphy Reid', rarity: 'rare', image: '' }
  ],
  Soccer: [
    { name: 'Erling Haaland', rarity: 'mythic', image: '' },
    { name: 'Mohamed Salah', rarity: 'legendary', image: '' },
    { name: 'Kevin De Bruyne', rarity: 'epic', image: '' },
    { name: 'Martin Ødegaard', rarity: 'epic', image: '' },
    { name: 'Allison Becker', rarity: 'epic', image: '' },
    { name: 'Virgil Van Dijk', rarity: 'epic', image: '' },
    { name: 'Son Heung-min', rarity: 'epic', image: '' }
  ],
  BBL: [
    { name: 'Glenn Maxwell', rarity: 'mythic', image: '' },
    { name: 'Rashid Khan', rarity: 'legendary', image: '' },
    { name: 'Shaun Marsh', rarity: 'epic', image: '' },
    { name: 'Josh Inglis', rarity: 'epic', image: '' },
    { name: 'Daniel Sams', rarity: 'rare', image: '' },
    { name: 'James Vince', rarity: 'rare', image: '' },
    { name: 'Chris Lynn', rarity: 'common', image: '' }
  ],
  AUS: [
    { name: 'Scott Boland', rarity: 'mythic', image: '' },
    { name: 'Pat Cummins', rarity: 'legendary', image: '' },
    { name: 'Matt Renshaw', rarity: 'epic', image: '' },
    { name: 'Cooper Connolly', rarity: 'epic', image: '' },
    { name: 'Nathan Lyon', rarity: 'rare', image: '' },
    { name: 'Travis Head', rarity: 'rare', image: '' },
    { name: 'Mitch Marsh', rarity: 'common', image: '' }
  ]
};

const rarityWeights = { mythic: 0.01, legendary: 0.04, epic: 0.10, rare: 0.35, common: 0.50 };
const sellValues = { mythic: 1000, legendary: 500, epic: 250, rare: 100, common: 25 };
let players = JSON.parse(JSON.stringify(basePlayers));
let inventory = [];
let coins = 600;

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
  let pool = sport === 'mixed' ? Object.keys(players).flatMap(s => players[s].map(p => ({...p, sport: s}))) : players[sport].map(p => ({...p, sport}));
  const targetRarity = chooseRarity();
  let candidates = pool.filter(p => p.rarity === targetRarity);
  if (!candidates.length) candidates = pool;
  return candidates[Math.floor(Math.random()*candidates.length)];
}

// --------------------------
// DOM Elements
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
const coinsDisplay = document.getElementById('coinsDisplay');
const inventoryArea = document.getElementById('inventoryArea');
const sellAllBtn = document.getElementById('sellAllBtn');

// --------------------------
// UI Functions
// --------------------------
function makeCard(p, fav=false) {
  const el = document.createElement('div');
  el.className = 'player-card';
  const avatarContent = p.image ? `<img src='${p.image}' alt='${p.name}' style='width:60px;height:60px;border-radius:50%;'>` : p.name.split(' ').map(n=>n[0]).join('');
  el.innerHTML = `<div class='avatar'>${avatarContent}</div>
                  <div class='meta'>
                    <h3>${p.name}</h3>
                    <p>${p.sport} • <span class='rarity ${p.rarity}'>${p.rarity.toUpperCase()}</span></p>
                    <p>Sell: ${sellValues[p.rarity]} coins</p>
                  </div>`;
  el.onclick = () => { p.fav = !p.fav; el.style.border = p.fav ? '2px solid gold' : '1px solid #ccc'; };
  return el;
}

function updateCoins() { coinsDisplay.textContent = `Coins: ${coins}`; }
function updateInventory() {
  inventoryArea.innerHTML = '';
  inventory.forEach(p=>inventoryArea.appendChild(makeCard(p,p.fav)));
}

// --------------------------
// Case Opening
// --------------------------
function animateOpen(pickFunc,count=1){
  caseInner.innerHTML = '';
  for(let i=0;i<12;i++) caseInner.appendChild(makeCard({name:'?',sport:'',rarity:'common'}));
  const results = Array.from({length:count},()=>pickFunc());
  setTimeout(()=>{
    caseInner.innerHTML='';
    results.forEach(r=>caseInner.appendChild(makeCard(r)));
    inventory.push(...results);
    updateInventory();
    showResult(results[0]);
  }, 900);
}

function showResult(p){
  resultArea.innerHTML = `<div class='big-card'>
    ${p.image?`<img src='${p.image}' alt='${p.name}' style='width:100px;height:100px;border-radius:50%;'>`:'?'}
    <div style='font-weight:800;'>${p.name}</div>
    <div>${p.sport}</div>
    <div><span class='rarity ${p.rarity}'>${p.rarity.toUpperCase()}</span></div>
    <div>Sell: ${sellValues[p.rarity]}</div>
  </div>`;
}

// --------------------------
// Daily Reward
// --------------------------
if(!localStorage.getItem('lastDaily') || (Date.now()-localStorage.getItem('lastDaily'))>24*60*60*1000){
  coins+=100;
  localStorage.setItem('lastDaily',Date.now());
}

// --------------------------
// Event Listeners
// --------------------------
openBtn.onclick = ()=>{ if(coins>=100){ coins-=100; updateCoins(); animateOpen(()=>pickOne(sportSelect.value)); } else alert('Not enough coins'); };
open5Btn.onclick = ()=>{ if(coins>=500){ coins-=500; updateCoins(); animateOpen(()=>pickOne(sportSelect.value),5); } else alert('Not enough coins'); };
sellAllBtn.onclick = ()=>{
  let sold = 0;
  inventory = inventory.filter(p=>{
    if(p.fav) return true;
    sold += sellValues[p.rarity];
    return false;
  });
  coins+=sold; updateCoins(); updateInventory();
};
importBtn.onclick = ()=>{
  const lines = customPlayers.value.split('\n').map(l=>l.trim()).filter(l=>l);
  for(const line of lines){
    const [sport,name,img] = line.split(':');
    if(sport && name){
      if(!players[sport]) players[sport]=[];
      players[sport].push({name,image:img||'',rarity:'common'});
    }
  }
  alert('Custom players imported!');
};
resetBtn.onclick = ()=>{
  players=JSON.parse(JSON.stringify(basePlayers));
  customPlayers.value='';
  alert('Players reset to defaults');
};

// --------------------------
// Initial Setup
// --------------------------
updateCoins();
updateInventory();
