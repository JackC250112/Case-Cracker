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
    { name: 'Bryce Cotton', rarity: 'legendary', image: '' },
    { name: 'Tyler Harvey', rarity: 'epic', image: '' },
    { name: 'Chris Goulding', rarity: 'rare', image: '' },
    { name: 'Nathan Sobey', rarity: 'common', image: '' }
  ],
  AFL: [
    { name: 'Dustin Martin', rarity: 'legendary', image: '' },
    { name: 'Nat Fyfe', rarity: 'epic', image: '' },
    { name: 'Patrick Voss', rarity: 'epic', image: '' },
    { name: 'Marcus Bontempelli', rarity: 'epic', image: '' }
  ],
  Soccer: [
    { name: 'Erling Haaland', rarity: 'legendary', image: '' },
    { name: 'Mohamed Salah', rarity: 'epic', image: '' },
    { name: 'Kevin De Bruyne', rarity: 'epic', image: '' },
    { name: 'Martin Ødegaard', rarity: 'epic', image: '' }
  ]
};

const rarityWeights = { legendary: 0.03, epic: 0.12, rare: 0.25, common: 0.60 };
let players = JSON.parse(JSON.stringify(basePlayers));
let coins = 600;
let lastDaily = 0;

// --------------------------
// DOM elements
// --------------------------
const caseInner = document.getElementById('caseInner');
const caseVisual = document.getElementById('caseVisual');
const resultArea = document.getElementById('resultArea');
const openBtn = document.getElementById('openBtn');
const open5Btn = document.getElementById('open5Btn');
const sportSelect = document.getElementById('sportSelect');
const customPlayers = document.getElementById('customPlayers');
const importBtn = document.getElementById('importBtn');
const resetBtn = document.getElementById('resetBtn');
const dailyBtn = document.getElementById('dailyBtn');
const coinDisplay = document.getElementById('coinDisplay');

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
  let candidates = pool.filter(p => p.rarity === targetRarity);
  if (!candidates.length) candidates = pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

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
// Case logic
// --------------------------
async function animateOpen(count = 1) {
  if (coins < 100 * count) { alert("Not enough coins!"); return; }
  coins -= 100 * count; updateCoins();
  caseInner.innerHTML = '';
  for (let i = 0; i < 12; i++) caseInner.appendChild(makeCard({ name:'?', sport:'', rarity:'common' }));
  const results = [];
  for (let i=0; i<count; i++){
    await new Promise(r=>setTimeout(r,200));
    const p = pickOne(sportSelect.value);
    caseInner.appendChild(makeCard(p));
    showResult(p);
    results.push(p);
  }
}

function updateCoins() { coinDisplay.textContent = `Coins: ${coins}`; }

// --------------------------
// Event listeners
// --------------------------
openBtn.addEventListener('click', ()=>animateOpen(1));
open5Btn.addEventListener('click', ()=>animateOpen(5));

importBtn.addEventListener('click', ()=>{
  const lines = customPlayers.value.split('\n').map(l=>l.trim()).filter(l=>l);
  for(const line of lines){
    const [sport,name,image]=line.split(':');
    if(sport && name){ if(!players[sport]) players[sport]=[]; players[sport].push({name,image:image||'',rarity:'common'}); }
  }
  alert('Custom players imported!');
});

resetBtn.addEventListener('click', ()=>{
  players = JSON.parse(JSON.stringify(basePlayers));
  customPlayers.value='';
  alert('Players reset!');
});

dailyBtn.addEventListener('click', ()=>{
  const now = Date.now();
  if(now - lastDaily < 24*60*60*1000){ alert("Daily reward already claimed!"); return; }
  coins += 200; lastDaily=now; updateCoins();
  alert("Daily reward claimed: 200 coins!");
});

updateCoins();
