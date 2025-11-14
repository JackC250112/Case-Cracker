// --------------------------
// Base player data
// --------------------------
const basePlayers = {
  NBA: [
    { name: 'LeBron James', rarity: 'legendary' },
    { name: 'Stephen Curry', rarity: 'epic' },
    { name: 'Joel Embiid', rarity: 'epic' },
    { name: 'Luka Doncic', rarity: 'rare' },
    { name: 'Jayson Tatum', rarity: 'rare' },
    { name: 'Victor Wembanyama', rarity: 'mythic' },
    { name: 'LaMelo Ball', rarity: 'epic' }
  ],
  NBL: [
    { name: 'Bryce Cotton', rarity: 'mythic' },
    { name: 'Tyler Harvey', rarity: 'epic' },
    { name: 'Chris Goulding', rarity: 'rare' },
    { name: 'Nathan Sobey', rarity: 'legendary' },
    { name: 'Admiral Schofield', rarity: 'common' },
    { name: 'Jaylen Adams', rarity: 'common' },
    { name: 'Jack McVeigh', rarity: 'common' }
  ],
  AFL: [
    { name: 'Dustin Martin', rarity: 'legendary' },
    { name: 'Nat Fyfe', rarity: 'mythic' },
    { name: 'Patrick Voss', rarity: 'epic' },
    { name: 'Marcus Bontempelli', rarity: 'epic' },
    { name: 'Nick Daicos', rarity: 'rare' },
    { name: 'Lachie Neale', rarity: 'rare' },
    { name: 'Murphy Reid', rarity: 'rare' }
  ],
  Soccer: [
    { name: 'Erling Haaland', rarity: 'legendary' },
    { name: 'Mohamed Salah', rarity: 'epic' },
    { name: 'Kevin De Bruyne', rarity: 'epic' },
    { name: 'Martin Ødegaard', rarity: 'epic' },
    { name: 'Alisson Becker', rarity: 'epic' },
    { name: 'Virgil Van Dijk', rarity: 'epic' },
    { name: 'Son Heung-min', rarity: 'epic' },
    { name: 'Pelé', rarity: 'mythic' },
    { name: 'Cristiano Ronaldo', rarity: 'legendary' },
    { name: 'Lionel Messi', rarity: 'common' }
  ],
  BBL: [
    { name: 'Glenn Maxwell', rarity: 'legendary' },
    { name: 'Rashid Khan', rarity: 'epic' },
    { name: 'Shaun Marsh', rarity: 'epic' },
    { name: 'Josh Inglis', rarity: 'rare' },
    { name: 'Daniel Sams', rarity: 'rare' },
    { name: 'James Vince', rarity: 'rare' },
    { name: 'Chris Lynn', rarity: 'common' }
  ],
  Cricket: [
    { name: 'Scott Boland', rarity: 'rare' },
    { name: 'Pat Cummins', rarity: 'legendary' },
    { name: 'Matt Renshaw', rarity: 'rare' },
    { name: 'Cooper Connolly', rarity: 'common' },
    { name: 'Nathan Lyon', rarity: 'epic' },
    { name: 'Travis Head', rarity: 'epic' },
    { name: 'Mitch Marsh', rarity: 'epic' }
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
// DOM elements
// --------------------------
const caseInner = document.getElementById('caseInner');
const inventoryArea = document.getElementById('inventoryArea');
const coinsDisplay = document.getElementById('coinsDisplay');
const openBtn = document.getElementById('openBtn');
const open5Btn = document.getElementById('open5Btn');
const sellAllBtn = document.getElementById('sellAllBtn');
const dailyBtn = document.getElementById('dailyBtn');
const resetBtn = document.getElementById('resetBtn');
const sportSelect = document.getElementById('sportSelect');
const delayInput = document.getElementById('delayInput');

// --------------------------
// Utility functions
// --------------------------
function chooseRarity(rng=Math.random){
  const r = rng();
  let sum = 0;
  for(const k of ['mythic','legendary','epic','rare','common']){
    sum += rarityWeights[k];
    if(r <= sum) return k;
  }
  return 'common';
}

function pickOne(sport){
  let pool = [];
  if(sport==='mixed'){
    for(const s of Object.keys(players)) pool = pool.concat(players[s].map(p=>({...p, sport:s})));
  }else{
    pool = players[sport].map(p=>({...p, sport}));
  }
  const targetRarity = chooseRarity();
  let candidates = pool.filter(p=>p.rarity.toLowerCase()===targetRarity);
  if(candidates.length===0) candidates = pool;
  const i = Math.floor(Math.random()*candidates.length);
  return candidates[i];
}

// --------------------------
// UI functions
// --------------------------
function makeCard(p){
  const el = document.createElement('div');
  el.className = 'player-card';
  const avatarContent = p.name.split(' ').slice(0,2).map(n=>n[0]).join('');
  el.innerHTML = `<div class='avatar' style='font-size:24px;font-weight:bold'>${avatarContent}</div>
                  <div class='meta'>
                    <h3>${p.name}</h3>
                    <p>${p.sport} • <span class='rarity ${p.rarity.toLowerCase()}'>${p.rarity.toUpperCase()}</span></p>
                    <button class='favBtn'>${p.favorited?'★':'☆'}</button>
                  </div>`;
  const favBtn = el.querySelector('.favBtn');
  favBtn.addEventListener('click',()=>{
    p.favorited = !p.favorited;
    favBtn.textContent = p.favorited?'★':'☆';
  });
  return el;
}

function updateInventory(){
  inventoryArea.innerHTML='';
  inventory.forEach(p=>inventoryArea.appendChild(makeCard(p)));
  coinsDisplay.textContent=`Coins: ${coins}`;
}

function addToInventory(p){
  inventory.push({...p, favorited:false});
  updateInventory();
}

function sellAll(){
  let sold=0;
  inventory = inventory.filter(p=>{
    if(p.favorited) return true;
    sold += raritySellValues[p.rarity.toLowerCase()];
    return false;
  });
  coins+=sold;
  updateInventory();
  alert(`Sold all non-favorited cards for ${sold} coins!`);
}

function animateOpen(count=1){
  if(coins<100){ alert('Not enough coins!'); return; }
  coins-=100;
  updateInventory();
  caseInner.innerHTML='';
  for(let i=0;i<12;i++) caseInner.appendChild(makeCard({name:'?', sport:'', rarity:'common'}));
  setTimeout(()=>{
    const results=[];
    for(let i=0;i<count;i++) results.push(pickOne(sportSelect.value));
    caseInner.innerHTML='';
    results.forEach(p=>{
      caseInner.appendChild(makeCard(p));
      addToInventory(p);
    });
  }, Number(delayInput.value)||900);
}

function claimDaily(){
  const today = new Date().toDateString();
  if(lastDailyClaim===today){ alert('Already claimed today!'); return; }
  coins+=dailyRewardAmount;
  lastDailyClaim=today;
  updateInventory();
  alert(`Daily reward: ${dailyRewardAmount} coins!`);
}

function resetGame(){
  players = JSON.parse(JSON.stringify(basePlayers));
  inventory=[];
  coins=600;
  lastDailyClaim=null;
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
