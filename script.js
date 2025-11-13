// --------------------------
// Base player data
// --------------------------
const basePlayers = {
  NBA: [
    { name: 'LeBron James', rarity: 'legendary', image: 'https://nba-players-images.s3.amazonaws.com/lebron.jpg' },
    { name: 'Stephen Curry', rarity: 'epic', image: 'https://nba-players-images.s3.amazonaws.com/curry.jpg' },
    { name: 'Joel Embiid', rarity: 'epic', image: 'https://nba-players-images.s3.amazonaws.com/embiid.jpg' },
    { name: 'Luka Doncic', rarity: 'rare', image: 'https://nba-players-images.s3.amazonaws.com/doncic.jpg' },
    { name: 'Jayson Tatum', rarity: 'rare', image: 'https://nba-players-images.s3.amazonaws.com/tatum.jpg' }
  ],
  NBL: [
    { name: 'NBL Star 1', rarity: 'epic', image: '' },
    { name: 'NBL Star 2', rarity: 'rare', image: '' }
  ],
  AFL: [
    { name: 'Dustin Martin', rarity: 'legendary', image: '' },
    { name: 'Nat Fyfe', rarity: 'epic', image: '' }
  ],
  PL: [
    { name: 'Erling Haaland', rarity: 'legendary', image: '' },
    { name: 'Mohamed Salah', rarity: 'epic', image: '' },
    { name: 'Kevin De Bruyne', rarity: 'epic', image: '' }
  ]
};

const rarityWeights = { legendary: 0.03, epic: 0.12, rare: 0.25, common: 0.60 };
let players = JSON.parse(JSON.stringify(basePlayers));

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
  for (const k of ['legendary', 'epic', 'rare', 'common']) {
    sum += rarityWeights[k];
    if (r <= sum) return k;
  }
  return 'common';
}

function pickOne(sport, seed = null) {
  const rng = seed != null ? seededRandom(seed) : Math.random;
  let pool = [];
  if (sport === 'mixed') {
    for (const s of Object.keys(players)) pool = pool.concat(players[s].map(p => ({ ...p, sport: s })));
  } else {
    pool = players[sport].map(p => ({ ...p, sport }));
  }
  const targetRarity = chooseRarity(rng);
  let candidates = pool.filter(p => p.rarity === targetRarity);
  if (candidates.length === 0) candidates = pool;
  const i = Math.floor(rng() * candidates.length);
  return candidates[i];
}

function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return h;
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
const seedInput = document.getElementById('seedInput');
const delayInput = document.getElementById('delayInput');
const customPlayers = document.getElementById('customPlayers');
const importBtn = document.getElementById('importBtn');
const resetBtn = document.getElementById('resetBtn');

// --------------------------
// UI functions
// --------------------------
function makeCard(p) {
  const el = document.createElement('div');
  el.className = 'player-card';
  const avatarContent = p.image ? `<img src='${p.image}' alt='${p.name}'>` :
    p.name.split(' ').slice(0, 2).map(n => n[0]).join('');
  el.innerHTML = `<div class='avatar'>${avatarContent}</div>
                  <div class='meta'>
                    <h3>${p.name}</h3>
                    <p>${p.sport} • <span class='rarity ${p.rarity}'>${p.rarity.toUpperCase()}</span></p>
                  </div>`;
  return el;
}

function showResult(p) {
  resultArea.innerHTML = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'big-card';
  const avatarContent = p.image ? `<img src='${p.image}' alt='${p.name}' style='width:100px;height:100px;object-fit:cover;border-radius:50%;'>` :
    p.name.split(' ').slice(0, 2).map(n => n[0]).join('');
  wrapper.innerHTML = `<div>${avatarContent}</div>
                       <div style='font-size:16px;font-weight:800;margin-top:8px'>${p.name}</div>
                       <div style='margin-top:6px;color:var(--muted)'>${p.sport}</div>
                       <div style='margin-top:10px'>
                         <span class='rarity ${p.rarity}'>${p.rarity.toUpperCase()}</span>
                       </div>`;
  resultArea.appendChild(wrapper);
  spawnConfetti();
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
    showResult(result[0]);
  } else {
    setTimeout(() => {
      caseInner.appendChild(makeCard(result));
      showResult(result);
    }, Number(delayInput.value) || 900);
  }
}

function pickOnce() {
  const sport = sportSelect.value;
  const seedText = seedInput.value.trim();
  const seedNum = seedText ? (hashCode(seedText) + Math.floor(Math.random() * 9999)) : null;
  return pickOne(sport, seedNum);
}

function pickMultiple(n) {
  const sport = sportSelect.value;
  const seedText = seedInput.value.trim();
  const seedBase = seedText ? hashCode(seedText) : null;
  const results = [];
  for (let i = 0; i < n; i++) {
    const s = seedBase != null ? seedBase + i * 7919 : null;
    results.push(pickOne(sport, s));
  }
  return results;
}

// --------------------------
// Event listeners
// --------------------------
openBtn.addEventListener('click', () => animateOpen(() => pickOnce()));
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
