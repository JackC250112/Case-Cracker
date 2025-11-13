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
    { name: 'Victor Wembanyama', rarity: 'legendary', image: 'https://nba-players-images.s3.amazonaws.com/wembanyama.jpg' },
    { name: 'LaMelo Ball', rarity: 'epic', image: 'https://nba-players-images.s3.amazonaws.com/lamelo.jpg' }
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
  ]
};

const rarityWeights = { legendary: 0.03, epic: 0.12, rare: 0.25, common: 0.60 };
let players = JSON.parse(JSON.stringify(basePlayers));

let coins = 600;
const packCost = 100;

// --------------------------
// Utility functions
// --------------------------
function chooseRarity() {
  const r = Math.random();
  let sum = 0;
  for (const k of ['legendary', 'epic', 'rare', 'common']) {
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
  const targetRarity = chooseRarity();
  let candidates = pool.filter(p => p.rarity.toLowerCase() === targetRarity);
  if (candidates.length === 0) candidates = pool;
  const i = Math.floor(Math.random() * candidates.length);
  return candidates[i];
}

function pickMultiple(n) {
  const sport = sportSelect.value;
  const results = [];
  for (let i = 0; i < n; i++) {
    results.push(pickOne(sport));
  }
  return results;
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
const customPlayers = document.getElementById('customPlayers');
const importBtn = document.getElementById('importBtn');
const resetBtn = document.getElementById('resetBtn');
const coinDisplay = document.getElementById('coinDisplay');

// --------------------------
// UI functions
// --------------------------
function updateCoins() {
  coinDisplay.textContent = `Coins: ${coins}`;
}

function getSellValue(rarity) {
  switch (rarity.toLowerCase()) {
    case 'legendary': return 500;
    case 'epic': return 300;
    case 'rare': return 150;
    case 'common': return 50;
    default: return 50;
  }
}

function makeCard(p) {
  const el = document.createElement('div');
  el.className = 'player-card';
  const avatarContent = p.image ? `<img src='${p.image}' alt='${p.name}' style='width:50px;height:50px;object-fit:cover;border-radius:50%;'>` :
    p.name.split(' ').slice(0, 2).map(n => n[0]).join('');
  el.innerHTML = `<div class='avatar'>${avatarContent}</div>
                  <div class='meta'>
                    <h3>${p.name}</h3>
                    <p>${p.sport} • <span class='rarity ${p.rarity.toLowerCase()}'>${p.rarity.toUpperCase()}</span></p>
                  </div>`;
  
  const sellBtn = document.createElement('button');
  sellBtn.textContent = `Sell Player (+${getSellValue(p.rarity)} coins)`;
  sellBtn.addEventListener('click', () => {
    coins += getSellValue(p.rarity);
    updateCoins();
    el.remove();
  });
  el.appendChild(sellBtn);

  return el;
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
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    piece.style.background = (i % 4 === 0) ? 'var(--gold)' : 'var(--accent)';
    piece.animate([{ transform: `translateY(0) rotate(${Math.random() * 200}deg)`, opacity: 1 },
                   { transform: `translateY(${120 + Math.random() * 200}px) rotate(${Math.random() * 800}deg)`, opacity: 0 }],
      { duration: 900 + Math.random() * 700, iterations: 1, easing: 'cubic-bezier(.2,.7,.2,1)' });
    c.appendChild(piece);
  }
  setTimeout(() => { c.remove(); }, 1600);
}

// --------------------------
// Case opening logic
// --------------------------
async function animateOpen(promisePick, count = 1) {
  if (coins < packCost) {
    alert("Not enough coins to open pack!");
    return;
  }
  coins -= packCost;
  updateCoins();

  caseInner.innerHTML = '';
  for (let i = 0; i < 12; i++) {
    caseInner.appendChild(makeCard({ name: '?', sport: '', rarity: 'common' }));
  }

  const result = await promisePick();
  if (Array.isArray(result)) {
    caseInner.innerHTML = '';
    for (let i = 0; i < result.length; i++) {
      await new Promise(r => setTimeout(r, 200));
      caseInner.appendChild(makeCard(result[i]));
    }
  } else {
    setTimeout(() => {
      caseInner.appendChild(makeCard(result));
    }, Number(delayInput.value) || 900);
  }
  spawnConfetti();
}

// --------------------------
// Event listeners
// --------------------------
openBtn.addEventListener('click', () => animateOpen(() => pickOne(sportSelect.value)));
open5Btn.addEventListener('click', () => animateOpen(() => pickMultiple(5), 5));
importBtn.addEventListener('click', () => {
  const lines = customPlayers.value.split('\n').map(l => l.trim()).filter(l => l);
  for (const line of lines) {
    const [sport, name, image] = line.split(':');
    if (sport && name) {
      if (!players[sport]) players[sport] = [];
      players[sport].push({ name, image: image || '', rarity: 'common' });
    }
  }
  alert('Custom players imported!');
});
resetBtn.addEventListener('click', () => {
  players = JSON.parse(JSON.stringify(basePlayers));
  customPlayers.value = '';
  alert('Players reset to defaults.');
});

// --------------------------
// Daily reward
// --------------------------
function claimDailyReward() {
  const lastClaim = localStorage.getItem('lastDailyClaim');
  const now = Date.now();
  if (!lastClaim || now - lastClaim > 24 * 60 * 60 * 1000) {
    coins += 200;
    localStorage.setItem('lastDailyClaim', now);
    alert('Daily reward claimed! +200 coins');
    updateCoins();
  } else {
    alert('Daily reward already claimed.');
  }
}

document.getElementById('dailyRewardBtn').addEventListener('click', claimDailyReward);

updateCoins();
