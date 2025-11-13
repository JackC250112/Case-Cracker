// --------------------------
// Base player data
// --------------------------
const basePlayers = {
  NBA: [
    { name:'LeBron James', rarity:'legendary', image:'https://nba-players-images.s3.amazonaws.com/lebron.jpg' },
    { name:'Stephen Curry', rarity:'epic', image:'https://nba-players-images.s3.amazonaws.com/curry.jpg' },
    { name:'Joel Embiid', rarity:'epic', image:'https://nba-players-images.s3.amazonaws.com/embiid.jpg' },
    { name:'Luka Doncic', rarity:'rare', image:'https://nba-players-images.s3.amazonaws.com/doncic.jpg' },
    { name:'Jayson Tatum', rarity:'rare', image:'https://nba-players-images.s3.amazonaws.com/tatum.jpg' },
    { name:'Victor Wembanyama', rarity:'mythic', image:'https://nba-players-images.s3.amazonaws.com/tatum.jpg' }
  ],
  NBL: [
    { name:'Bryce Cotton', rarity:'mythic', image:'' },
    { name:'Tyler Harvey', rarity:'epic', image:'' },
    { name:'Chris Goulding', rarity:'rare', image:'' },
    { name:'Nathan Sobey', rarity:'common', image:'' }
  ],
  AFL: [
    { name:'Dustin Martin', rarity:'mythic', image:'' },
    { name:'Nat Fyfe', rarity:'legendary', image:'' },
    { name:'Patrick Voss', rarity:'epic', image:'' },
    { name:'Marcus Bontempelli', rarity:'epic', image:'' },
    { name:'Nick Daicos', rarity:'rare', image:'' }
  ],
  Soccer: [
    { name:'Erling Haaland', rarity:'mythic', image:'' },
    { name:'Mohamed Salah', rarity:'legendary', image:'' },
    { name:'Kevin De Bruyne', rarity:'epic', image:'' },
    { name:'Martin Ødegaard', rarity:'epic', image:'' }
  ]
};

const rarityWeights = { mythic:0.01, legendary:0.04, epic:0.10, rare:0.35, common:0.50 };
const sellValues = { mythic:1000, legendary:500, epic:250, rare:100, common:25 };
let players = JSON.parse(JSON.stringify(basePlayers));
let inventory = [];
let coins = 600;

// --------------------------
// DOM elements
// --------------------------
const caseInner = document.getElementById('caseInner');
const caseVisual = document.getElementById('caseVisual');
const resultArea = document.getElementById('resultArea');
const openBtn = document.getElementById('openBtn');
const dailyBtn = document.getElementById('dailyBtn');
const customPlayers = document.getElementById('customPlayers');
const importBtn = document.getElementById('importBtn');
const resetBtn = document.getElementById('resetBtn');
const inventoryDiv = document.getElementById('inventory');
const sellAllBtn = document.getElementById('sellAllBtn');
const coinDisplay = document.getElementById('coinDisplay');

// --------------------------
// Utilities
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

function pickOne() {
  let pool = [];
  for (const sport of Object.keys(players)) pool = pool.concat(players[sport].map(p => ({ ...p, sport })));
  const rarity = chooseRarity();
  let candidates = pool.filter(p=>p.rarity===rarity);
  if(candidates.length===0) candidates = pool;
  return candidates[Math.floor(Math.random()*candidates.length)];
}

// --------------------------
// UI functions
// --------------------------
function makeCard(p) {
  const el = document.createElement('div');
  el.className='player-card';
  const avatar = p.image ? `<img src='${p.image}' alt='${p.name}' width=50>` : p.name.split(' ').map(n=>n[0]).join('');
  el.innerHTML=`<div>${avatar}</div>
                <div>${p.name}</div>
                <div>${p.sport} • <span class='rarity ${p.rarity}'>${p.rarity.toUpperCase()}</span></div>
                <div>Sell: ${sellValues[p.rarity]} coins</div>
                <div class='favorite' title='Click to favorite'>♡</div>`;
  const fav = el.querySelector('.favorite');
  fav.onclick=()=>{
    p.fav = !p.fav;
    fav.textContent = p.fav ? '♥' : '♡';
  };
  return el;
}

function updateInventory() {
  inventoryDiv.innerHTML='';
  for(const p of inventory) inventoryDiv.appendChild(makeCard(p));
}

function spawnConfetti() {
  const c = document.createElement('div');
  c.className='confetti';
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
    piece.style.background=(i%4===0)?'var(--gold)':'var(--accent)';
    piece.animate([{transform:`translateY(0)`,opacity:1},{transform:`translateY(${120+Math.random()*200}px)`,opacity:0}],
      {duration:900+Math.random()*700,iterations:1,easing:'cubic-bezier(.2,.7,.2,1)'});
    c.appendChild(piece);
  }
  setTimeout(()=>{c.remove()},1600);
}

// --------------------------
// Actions
// --------------------------
openBtn.addEventListener('click',()=>{
  if(coins<100){ alert("Not enough coins!"); return;}
  coins-=100;
  coinDisplay.textContent=coins;
  caseInner.innerHTML='';
  for(let i=0;i<12;i++) caseInner.appendChild(makeCard({name:'?',sport:'',rarity:'common'}));
  const p = pickOne();
  inventory.push(p);
  setTimeout(()=>{
    caseInner.innerHTML='';
    caseInner.appendChild(makeCard(p));
    spawnConfetti();
    updateInventory();
  },900);
});

dailyBtn.addEventListener('click',()=>{
  coins+=200;
  coinDisplay.textContent=coins;
  alert("Daily reward +200 coins!");
});

importBtn.addEventListener('click',()=>{
  const lines=customPlayers.value.split('\n').map(l=>l.trim()).filter(l=>l);
  for(const line of lines){
    const [sport,name,image]=line.split(':');
    if(sport && name){ if(!players[sport]) players[sport]=[]; players[sport].push({name,image:image||'',rarity:'common'}); }
  }
  alert("Custom players imported!");
});

resetBtn.addEventListener('click',()=>{
  players=JSON.parse(JSON.stringify(basePlayers));
  customPlayers.value='';
  alert("Players reset!");
});

sellAllBtn.addEventListener('click',()=>{
  let earned=0;
  inventory=inventory.filter(p=>{
    if(p.fav) return true;
    earned+=sellValues[p.rarity];
    return false;
  });
  coins+=earned;
  coinDisplay.textContent=coins;
  updateInventory();
  alert(`Sold all non-favorites for ${earned} coins!`);
});

// Initial display
coinDisplay.textContent=coins;
updateInventory();
