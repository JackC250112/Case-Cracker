// --------------------------
// Base player data
// --------------------------
const basePlayers = {
  NBA: [ { name:'LeBron James', rarity:'ultra' }, { name:'Stephen Curry', rarity:'legendary' }, { name:'Joel Embiid', rarity:'epic' }, { name:'Luka Doncic', rarity:'rare' }, { name:'Jayson Tatum', rarity:'rare' }, { name:'Victor Wembanyama', rarity:'mythic' }, { name:'LaMelo Ball', rarity:'epic' } ],
  NBL: [ { name:'Bryce Cotton', rarity:'ultra' }, { name:'Tyler Harvey', rarity:'epic' }, { name:'Chris Goulding', rarity:'mythic' }, { name:'Nathan Sobey', rarity:'legendary' }, { name:'Admiral Schofield', rarity:'common' }, { name:'Jaylen Adams', rarity:'common' }, { name:'Jack McVeigh', rarity:'common' } ],
  AFL: [ { name:'Dustin Martin', rarity:'legendary' }, { name:'Nat Fyfe', rarity:'mythic' }, { name:'Patrick Voss', rarity:'ultra' }, { name:'Marcus Bontempelli', rarity:'epic' }, { name:'Nick Daicos', rarity:'rare' }, { name:'Lachie Neale', rarity:'rare' }, { name:'Murphy Reid', rarity:'rare' } ],
  Soccer: [ { name:'Erling Haaland', rarity:'legendary' }, { name:'Mohamed Salah', rarity:'epic' }, { name:'Kevin De Bruyne', rarity:'epic' }, { name:'Martin Ødegaard', rarity:'epic' }, { name:'Alisson Becker', rarity:'epic' }, { name:'Virgil Van Dijk', rarity:'epic' }, { name:'Son Heung-min', rarity:'epic' }, { name:'Pelé', rarity:'ultra' }, { name:'Cristiano Ronaldo', rarity:'mythic' }, { name:'Lionel Messi', rarity:'common' }, { name:'Daniel James', rarity:'legendary' } ],
  BBL: [ { name:'Glenn Maxwell', rarity:'ultra' }, { name:'Rashid Khan', rarity:'epic' }, { name:'Shaun Marsh', rarity:'epic' }, { name:'Josh Inglis', rarity:'legendary' }, { name:'Daniel Sams', rarity:'rare' }, { name:'James Vince', rarity:'mythic' }, { name:'Chris Lynn', rarity:'common' } ],
  Cricket: [ { name:'Scott Boland', rarity:'rare' }, { name:'Pat Cummins', rarity:'legendary' }, { name:'Matt Renshaw', rarity:'ultra' }, { name:'Cooper Connolly', rarity:'common' }, { name:'Nathan Lyon', rarity:'mythic' }, { name:'Travis Head', rarity:'epic' }, { name:'Mitch Marsh', rarity:'epic' } ]
};

// --------------------------
// Game config
// --------------------------
const rarityWeights = { ultra:0.002, mythic:0.005, legendary:0.04, epic:0.10, rare:0.35, common:0.503 };
const raritySellValues = { ultra:750, mythic:500, legendary:250, epic:100, rare:50, common:25 };

let players = JSON.parse(JSON.stringify(basePlayers));
let inventory = [];
let coins = 600;
let dailyRewardAmount = 300;
let lastDailyClaim = localStorage.getItem('lastDailyClaim');

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
const rarityInfoList = document.getElementById('rarityInfo');

// --------------------------
// Utility functions
// --------------------------
function chooseRarity(rng=Math.random){
  let r = rng(), sum=0;
  for(const k of ['ultra','mythic','legendary','epic','rare','common']){
    sum+=rarityWeights[k];
    if(r<=sum) return k;
  }
  return 'common';
}

function pickOne(sport){
  let pool=[];
  if(sport==='mixed'){
    for(const s in players) pool=pool.concat(players[s].map(p=>({...p, sport:s})));
  } else pool=players[sport].map(p=>({...p, sport}));
  
  const targetRarity = chooseRarity();
  let candidates = pool.filter(p=>p.rarity.toLowerCase()===targetRarity);
  if(candidates.length===0) candidates=pool;
  return candidates[Math.floor(Math.random()*candidates.length)];
}

// --------------------------
// UI functions
// --------------------------
function makeCard(p){
  const el = document.createElement('div');
  el.className = 'player-card';
  const avatarContent = p.name.split(' ').slice(0,2).map(n=>n[0]).join('');
  el.innerHTML = `<div class='avatar'>${avatarContent}</div>
  <div class='meta'>
    <h3>${p.name}</h3>
    <p>${p.sport} • <span class='rarity ${p.rarity.toLowerCase()}'>${p.rarity.toUpperCase()}</span></p>
    <button class='favBtn'>${p.favorited?'★':'☆'}</button>
  </div>`;
  el.querySelector('.favBtn').addEventListener('click',()=>{
    p.favorited=!p.favorited;
    el.querySelector('.favBtn').textContent=p.favorited?'★':'☆';
  });
  return el;
}

function updateInventory(){
  inventoryArea.innerHTML='';
  inventory.forEach(p=>inventoryArea.appendChild(makeCard(p)));
  coinsDisplay.textContent=`Coins: ${coins}`;
}

// --------------------------
// Sell / Open / Daily
// --------------------------
function addToInventory(p){ inventory.push({...p, favorited:false}); updateInventory(); }

function sellAll(){
  let sold=0;
  inventory=inventory.filter(p=>{
    if(p.favorited) return true;
    sold+=raritySellValues[p.rarity.toLowerCase()];
    return false;
  });
  coins+=sold;
  updateInventory();
  alert(`Sold all non-favorited cards for ${sold} coins!`);
}

function animateOpen(count=1){
  let cost=count===1?100:500;
  if(coins<cost){ alert('Not enough coins!'); return; }
  coins-=cost;
  updateInventory();
  
  caseInner.innerHTML='';
  for(let i=0;i<12;i++) caseInner.appendChild(makeCard({name:'?',sport:'',rarity:'common'}));
  
  const results=[];
  for(let i=0;i<count;i++) results.push(pickOne(sportSelect.value));
  
  caseInner.innerHTML='';
  results.forEach((p,i)=>{
    setTimeout(()=>{ caseInner.appendChild(makeCard(p)); addToInventory(p); }, i*(Number(delayInput.value)||200));
  });
}

function claimDaily(){
  const today = new Date().toDateString();
  if(lastDailyClaim===today){ alert('Already claimed today!'); return; }
  coins+=dailyRewardAmount;
  lastDailyClaim=today;
  localStorage.setItem('lastDailyClaim',today);
  updateInventory();
  alert(`Daily reward: ${dailyRewardAmount} coins!`);
}

function resetGame(){
  players=JSON.parse(JSON.stringify(basePlayers));
  inventory=[];
  coins=600;
  lastDailyClaim=null;
  localStorage.removeItem('lastDailyClaim');
  updateInventory();
}

// --------------------------
// Info panel
// --------------------------
function updateRarityInfo(){
  rarityInfoList.innerHTML='';
  for(const r in raritySellValues){
    const chance = (rarityWeights[r]*100).toFixed(2);
    const li = document.createElement('li');
    li.textContent=`${r.toUpperCase()}: Sell Value = ${raritySellValues[r]} coins, Chance = ${chance}%`;
    rarityInfoList.appendChild(li);
  }
}

// --------------------------
// Event listeners
// --------------------------
openBtn.addEventListener('click',()=>animateOpen(1));
open5Btn.addEventListener('click',()=>animateOpen(5));
sellAllBtn.addEventListener('click',sellAll);
dailyBtn.addEventListener('click',claimDaily);
resetBtn.addEventListener('click',resetGame);

// --------------------------
// Initial display
// --------------------------
updateInventory();
updateRarityInfo();
