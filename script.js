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
    { name: 'Bryce Cotton', rarity: 'mythic', image: '' },
    { name: 'Tyler Harvey', rarity: 'epic', image: '' },
    { name: 'Chris Goulding', rarity: 'rare', image: '' },
    { name: 'Nathan Sobey', rarity: 'common', image: '' },
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
    { name: 'Alisson Becker', rarity: 'epic', image: '' },
    { name: 'Virgil Van Dijk', rarity: 'rare', image: '' },
    { name: 'Son Heung-min', rarity: 'rare', image: '' }
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
  AustCricket: [
    { name: 'Scott Boland', rarity: 'mythic', image: '' },
    { name: 'Pat Cummins', rarity: 'legendary', image: '' },
    { name: 'Matt Renshaw', rarity: 'epic', image: '' },
    { name: 'Cooper Connolly', rarity: 'epic', image: '' },
    { name: 'Nathan Lyon', rarity: 'rare', image: '' },
    { name: 'Travis Head', rarity: 'rare', image: '' },
    { name: 'Mitch Marsh', rarity: 'common', image: '' }
  ]
};

// --------------------------
// Rarity weights and sell values
// --------------------------
const rarityWeights = { mythic: 0.01, legendary: 0.04, epic: 0.10, rare: 0.35, common: 0.50 };
const sellValues = { mythic: 1000, legendary: 500, epic: 250, rare: 100, common: 25 };

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
const open5Btn = document.getElementById('open5Btn');
const sellAllBtn = document.getElementById('sellAllBtn');
const resetBtn = document.getElementById('resetBtn');
const sportSelect = document.getElementById('sportSelect');
const customPlayers = document.getElementById('customPlayers');
const importBtn = document.getElementById('importBtn');
const inventoryDiv = document.getElementById('inventory');
const coinDisplay = document.getElementById('coinDisplay');

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
    let pool = sport === 'mixed' ? Object.values(players).flat() : players[sport];
    const targetRarity = chooseRarity();
    let candidates = pool.filter(p => p.rarity === targetRarity);
    if (!candidates.length) candidates = pool;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    inventory.push({...pick, favorite:false});
    return pick;
}

function makeCard(p) {
    const el = document.createElement('div');
    el.className = 'player-card';
    const avatar = p.image ? `<img src='${p.image}' alt='${p.name}'>` : p.name.split(' ').slice(0,2).map(n=>n[0]).join('');
    el.innerHTML = `<div class='avatar'>${avatar}</div>
                    <div class='meta'>
                      <h3>${p.name}</h3>
                      <p>${p.rarity.toUpperCase()}</p>
                      <button class='favBtn'>${p.favorite?'★':'☆'}</button>
                    </div>`;
    const favBtn = el.querySelector('.favBtn');
    favBtn.addEventListener('click', () => {
        p.favorite = !p.favorite;
        favBtn.textContent = p.favorite ? '★' : '☆';
    });
    return el;
}

function showResult(p) {
    resultArea.innerHTML = '';
    const card = makeCard(p);
    resultArea.appendChild(card);
    updateInventoryDisplay();
    spawnConfetti();
}

function updateInventoryDisplay() {
    inventoryDiv.innerHTML = inventory.map(p => `${p.name} (${p.rarity})${p.favorite?' ★':''}`).join('<br>') || 'Empty';
}

function updateCoinsDisplay() {
    coinDisplay.textContent = `Coins: ${coins}`;
}

function spawnConfetti() {
    const c = document.createElement('div');
    c.className = 'confetti';
    caseVisual.appendChild(c);
    for (let i=0;i<18;i++){
        const piece=document.createElement('div');
        piece.style.position='absolute';
        piece.style.left=(50+Math.random()*240-120)+'px';
        piece.style.top=(40+Math.random()*80)+'px';
        piece.style.width='8px';
        piece.style.height='8px';
        piece.style.opacity='0.95';
        piece.style.borderRadius='2px';
        piece.style.transform=`rotate(${Math.random()*360}deg)`;
        piece.style.background=(i%4===0)?'var(--gold)':'var(--accent)';
        piece.animate([{transform:`translateY(0) rotate(${Math.random()*200}deg)`, opacity:1},
                       {transform:`translateY(${120+Math.random()*200}px) rotate(${Math.random()*800}deg)`, opacity:0}],
                      {duration:900+Math.random()*700, iterations:1, easing:'cubic-bezier(.2,.7,.2,1)'});
        c.appendChild(piece);
    }
    setTimeout(()=>{c.remove()},1600);
}

// --------------------------
// Case opening
// --------------------------
function openCase(n=1) {
    const cost = n*100;
    if(coins < cost){ alert('Not enough coins!'); return; }
    coins -= cost;
    updateCoinsDisplay();
    caseInner.innerHTML = '';
    for(let i=0;i<n;i++){
        const p = pickOne(sportSelect.value);
        setTimeout(()=>showResult(p), i*500);
    }
}

// --------------------------
// Sell functionality
// --------------------------
sellAllBtn.addEventListener('click',()=>{
    let sold = 0;
    inventory = inventory.filter(p=>{
        if(p.favorite) return true;
        sold += sellValues[p.rarity]||0;
        return false;
    });
    coins += sold;
    updateCoinsDisplay();
    updateInventoryDisplay();
    alert(`Sold all unfavorited cards for ${sold} coins!`);
});

// --------------------------
// Reset functionality
// --------------------------
resetBtn.addEventListener('click',()=>{
    inventory = [];
    coins = 600;
    players = JSON.parse(JSON.stringify(basePlayers));
    caseInner.innerHTML='No pulls yet';
    resultArea.innerHTML='';
    updateCoinsDisplay();
    updateInventoryDisplay();
    alert('Game reset!');
});

// --------------------------
// Buttons
// --------------------------
openBtn.addEventListener('click',()=>openCase(1));
open5Btn.addEventListener('click',()=>openCase(5));
importBtn.addEventListener('click',()=>{
    const lines = customPlayers.value.split('\n').map(l=>l.trim()).filter(l=>l);
    for(const line of lines){
        const [sport,name,image,rarity]=line.split(':');
        if(sport && name){
            if(!players[sport]) players[sport]=[];
            players[sport].push({name,image:image||'',rarity:rarity||'common'});
        }
    }
    alert('Custom players imported!');
});

updateCoinsDisplay();
updateInventoryDisplay();
