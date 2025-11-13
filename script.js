// --------------------------
// Game config
// --------------------------
let coins = 600; // Starting coins
const packCost = 100;

const sellPrices = {
  mythic: 1000,
  legendary: 500,
  epic: 250,
  rare: 100,
  common: 50
};

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
  ]
};

let players = JSON.parse(JSON.stringify(basePlayers));
let inventory = []; // Player cards you’ve opened
let favorited = new Set(); // Cards you’ve marked as “favorite” and won’t sell

// --------------------------
// DOM elements
// --------------------------
const coinsDisplay = document.getElementById('coinsDisplay');
const inventoryDisplay = document.getElementById('inventoryDisplay');
const openBtn = document.getElementById('openBtn');
const sellAllBtn = document.getElementById('sellAllBtn');
const caseInner = document.getElementById('caseInner');

// --------------------------
// Utility functions
// --------------------------
function updateCoins() {
  coinsDisplay.textContent = `Coins: ${coins}`;
}

function addToInventory(card) {
  inventory.push(card);
  renderInventory();
}

function renderInventory() {
  inventoryDisplay.innerHTML = '';
  inventory.forEach((card, i) => {
    const div = document.createElement('div');
    div.className = 'inventory-card';
    div.innerHTML = `<span>${card.name} (${card.rarity})</span> <button data-index="${i}" class="favoriteBtn">${favorited.has(i) ? '★' : '☆'}</button>`;
    inventoryDisplay.appendChild(div);
  });

  document.querySelectorAll('.favoriteBtn').forEach(btn => {
    btn.onclick = () => {
      const idx = Number(btn.getAttribute('data-index'));
      if (favorited.has(idx)) favorited.delete(idx);
      else favorited.add(idx);
      renderInventory();
    };
  });
}

// Sell all non-favorited cards
function sellAll() {
  let earned = 0;
  inventory = inventory.filter((card, i) => {
    if (!favorited.has(i)) {
      earned += sellPrices[card.rarity.toLowerCase()] || 0;
      return false; // remove from inventory
    }
    return true; // keep favorited
  });
  coins += earned;
  favorited.clear();
  updateCoins();
  renderInventory();
  alert(`Sold all non-favorited cards for ${earned} coins!`);
}

// --------------------------
// Case opening
// --------------------------
function openPack() {
  if (coins < packCost) {
    alert("Not enough coins to open a pack!");
    return;
  }
  coins -= packCost;
  updateCoins();

  const sports = Object.keys(players);
  const randomSport = sports[Math.floor(Math.random() * sports.length)];
  const pool = players[randomSport];

  // Probability distribution
  const rand = Math.random();
  let rarity;
  if (rand < 0.02) rarity = 'mythic';
  else if (rand < 0.05) rarity = 'legendary';
  else if (rand < 0.15) rarity = 'epic';
  else if (rand < 0.35) rarity = 'rare';
  else rarity = 'common';

  const candidates = pool.filter(p => p.rarity.toLowerCase() === rarity);
  const card = candidates[Math.floor(Math.random() * candidates.length)];
  addToInventory(card);

  caseInner.textContent = `You pulled: ${card.name} (${card.rarity})`;
}

// --------------------------
// Event listeners
// --------------------------
openBtn.addEventListener('click', openPack);
sellAllBtn.addEventListener('click', sellAll);

// Initial display
updateCoins();
renderInventory();
