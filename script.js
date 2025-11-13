// --------------------------
// Base player data
// --------------------------
const basePlayers = {
  NBA: [
    { name: 'LeBron James', rarity: 'legendary', image: 'https://nba-players-images.s3.amazonaws.com/lebron.jpg' },
    { name: 'Stephen Curry', rarity: 'epic', image: 'https://nba-players-images.s3.amazonaws.com/curry.jpg' },
    { name: 'Joel Embiid', rarity: 'epic', image: 'https://nba-players-images.s3.amazonaws.com/embiid.jpg' },
    { name: 'Luka Doncic', rarity: 'rare', image: 'https://nba-players-images.s3.amazonaws.com/doncic.jpg' },
    { name: 'Jayson Tatum', rarity: 'rare', image: 'https://nba-players-images.s3.amazonaws.com/tatum.jpg' },
    { name: 'Victor Wembanyama', rarity: 'mythic', image: 'https://nba-players-images.s3.amazonaws.com/tatum.jpg' },
    { name: 'LaMelo Ball', rarity: 'epic', image: 'https://nba-players-images.s3.amazonaws.com/tatum.jpg' }
  ],
  NBL: [
    { name: 'Bryce Cotton', rarity: 'legendary', image: '' },
    { name: 'Tyler Harvey', rarity: 'epic', image: '' },
    { name: 'Chris Goulding', rarity: 'rare', image: '' },
    { name: 'Nathan Sobey', rarity: 'common', image: '' },
    { name: 'Admiral Schofield', rarity: 'common', image: '' },
    { name: 'Jaylen Adams', rarity: 'common', image: '' },
    { name: 'Jack McVeigh', rarity: 'common', image: '' }
  ],
  AFL: [
    { name: 'Dustin Martin', rarity: 'legendary', image: '' },
    { name: 'Nat Fyfe', rarity: 'epic', image: '' },
    { name: 'Patrick Voss', rarity: 'epic', image: '' },
    { name: 'Marcus Bontempelli', rarity: 'epic', image: '' },
    { name: 'Nick Daicos', rarity: 'rare', image: '' },
    { name: 'Lachie Neale', rarity: 'rare', image: '' },
    { name: 'Murphy Reid', rarity: 'rare', image: '' }
  ],
  Soccer: [
    { name: 'Erling Haaland', rarity: 'legendary', image: '' },
    { name: 'Mohamed Salah', rarity: 'epic', image: '' },
    { name: 'Kevin De Bruyne', rarity: 'epic', image: '' },
    { name: 'Martin Ødegaard', rarity: 'epic', image: '' },
    { name: 'Alisson Becker', rarity: 'epic', image: '' },
    { name: 'Virgil Van Dijk', rarity: 'epic', image: '' },
    { name: 'Son Heung-min', rarity: 'epic', image: '' }
  ],
  BBL: [
    { name: 'Glenn Maxwell', rarity: 'legendary', image: '' },
    { name: 'Rashid Khan', rarity: 'epic', image: '' },
    { name: 'Shaun Marsh', rarity: 'epic', image: '' },
    { name: 'Josh Inglis', rarity: 'rare', image: '' },
    { name: 'Daniel Sams', rarity: 'rare', image: '' },
    { name: 'James Vince', rarity: 'rare', image: '' },
    { name: 'Chris Lynn', rarity: 'common', image: '' }
  ],
  Cricket: [
    { name: 'Scott Boland', rarity: 'rare', image: '' },
    { name: 'Pat Cummins', rarity: 'legendary', image: '' },
    { name: 'Matt Renshaw', rarity: 'rare', image: '' },
    { name: 'Cooper Connolly', rarity: 'common', image: '' },
    { name: 'Nathan Lyon', rarity: 'epic', image: '' },
    { name: 'Travis Head', rarity: 'epic', image: '' },
    { name: 'Mitch Marsh', rarity: 'epic', image: '' }
  ]
};

const rarityWeights = { mythic: 0.01, legendary: 0.04, epic: 0.10, rare: 0.35, common: 0.50 };
const raritySellValues = { mythic: 1000, legendary: 500, epic: 250, rare: 100, common: 25 };

let players = JSON.parse(JSON.stringify(basePlayers));
let inventory = [];
let coins = 600;
let dailyRewardAmount = 300;
let lastDailyClaim = null;

// --------------------------
// Utility functions
// --------------------------
function seededRandom(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function chooseRarity(rng) {
  const r = rng();
  let sum = 0;
  for (const k of ['mythic','legendary','epic','rare','common']) {
    sum += rarityWeights[k];
    if (r <= sum) return k;
  }
  return 'common';
}

function pickOne(sport) {
  let pool = [];
  if (sport === 'mixed') {
    for (const s of Object.keys(players)) pool = pool.concat(players[s].map(p => ({ ...p, sport: s })));
  } else {
    pool = players[sport].map(p => ({ ...p, sport }));
  }
  const targetRarity = chooseRarity(Math.random);
  let candidates = pool.filter(p => p.rarity.toLowerCase() === targetRarity);
  if (candidates.length === 0) candidates = pool;
  const i = Math.floor(Math.random() * candidates.length);
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
const sportSelect = document.getElementById('sportSelect');
const delayInput = document.getElementById('delayInput');
const inventoryArea = document.getElementById('inventoryArea');
const coinsDisplay = document.getElementById('coinsDisplay');
const dailyBtn = document.getElementById('dailyBtn');
const sellAllBtn = document.getElementById('sellAllBtn');
const resetBtn = document.getElementById('resetBtn');

// --------------------------
// UI functions
// --------------------------
function makeCard(p) {
  const el = document.createElement('div');
  el.className = 'player-card';
  const avatarContent = p.image ? `<img src='${p.image}' alt='${p.name}'>` :
    p.name.split(' ').slice(0,2).map(n=>n[0]).join('');
  el.innerHTML = `<div class='avatar'>${avatarContent}</div>
                  <div class='meta'>
                    <h3>${p.name}</h3>
                    <p>${p.sport} • <span class='rarity ${p.rarity.toLowerCase()}'>${p.rarity.toUpperCase()}</span></p>
                    <button class='favBtn'>${p.favorited?'★':'☆'}</button>
                  </div>`;
  const favBtn = el.querySelector('.favBtn');
  favBtn.addEventListener('click', ()=>{
    p.favorited = !p.favorited;
    favBtn.textContent = p.favorited?'★':'☆';
  });
  return el;
}

function updateInventory() {
  inventoryArea.innerHTML = '';
  inventory.forEach(p => inventoryArea.appendChild(makeCard(p)));
  coinsDisplay.textContent = `Coins: ${coins}`;
}

function addToInventory(p) {
  inventory.push({...p, favorited:false});
  updateInventory();
}

function sellAll() {
  let sold = 0;
  inventory = inventory.filter(p=>{
    if(p.favorited) return true;
    sold += raritySellValues[p.rarity.toLowerCase()];
    return false;
  });
  coins += sold;
  updateInventory();
  alert(`Sold all non-favorited cards for ${sold} coins!`);
}

function animateOpen(count=1) {
  if(coins < 100) { alert('Not enough coins!'); return; }
  coins -= 100;
  coinsDisplay.textContent = `Coins: ${coins}`;
  caseInner.innerHTML = '';
  for(let i=0;i<12;i++) caseInner.appendChild(makeCard({name:'?', sport:'', rarity:'common'}));
  setTimeout(()=>{
    const results = [];
    for(let i=0;i<count;i++) results.push(pickOne(sportSelect.value));
    caseInner.innerHTML='';
    results.forEach(p=>{
      caseInner.appendChild(makeCard(p));
      addToInventory(p);
    });
  }, Number(delayInput.value)||900);
}

function claimDaily() {
  const today = new Date().toDateString();
  if(lastDailyClaim===today){ alert('Already claimed today!'); return; }
  coins += dailyRewardAmount;
  lastDailyClaim = today;
  updateInventory();
  alert(`Daily reward: ${dailyRewardAmount} coins!`);
}

function resetGame() {
  players = JSON.parse(JSON.stringify(basePlayers));
  inventory = [];
  coins = 600;
  lastDailyClaim = null;
  updateInventory();
}

// --------------------------
// Event listeners
// --------------------------
openBtn.addEventListener('click', ()=>animateOpen(1));
open5Btn.addEventListener('click', ()=>animateOpen(5));
sellAllBtn.addEventListener('click', sellAll);
dailyBtn.addEventListener('click', claimDaily);
resetBtn.addEventListener('click', resetGame);

// --------------------------
// Initial display
// --------------------------
updateInventory();
