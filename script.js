// ----- GAME DATA -----

const rarities = [
    { name: "Mythic", chance: 0.01, value: 1000 },
    { name: "Legendary", chance: 0.04, value: 500 },
    { name: "Epic", chance: 0.10, value: 250 },
    { name: "Rare", chance: 0.35, value: 100 },
    { name: "Common", chance: 0.50, value: 25 }
];

const players = {
    nba: [
        "LeBron James", "Stephen Curry", "Kevin Durant", "Nikola Jokic", "Joel Embiid",
        "Luka Doncic", "Jayson Tatum", "Kawhi Leonard", "Anthony Davis", "Damian Lillard",
        "Giannis Antetokounmpo", "Kyrie Irving", "Shai Gilgeous-Alexander", "James Harden"
    ]
};

// ----- STATE -----

let coins = parseInt(localStorage.getItem("coins")) || 0;
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let lastDaily = localStorage.getItem("lastDaily") || null;

// ----- ELEMENTS -----

const coinsEl = document.getElementById("coins");
const pullBox = document.getElementById("pull-box");
const inventoryEl = document.getElementById("inventory");

updateCoins();
renderInventory();

// ----- RANDOM PLAYER -----

function pickRarity() {
    let r = Math.random();
    let sum = 0;

    for (let item of rarities) {
        sum += item.chance;
        if (r <= sum) return item;
    }
    return rarities[4]; // fallback: common
}

function getRandomPlayer(list) {
    return list[Math.floor(Math.random() * list.length)];
}

// ----- OPEN CASE -----

function openCase() {
    if (coins < 100) {
        pullBox.innerText = "Not enough coins!";
        return;
    }

    coins -= 100;

    let rarity = pickRarity();
    let player = getRandomPlayer(players.nba);

    let pull = {
        name: player,
        rarity: rarity.name,
        value: rarity.value,
        fav: false
    };

    inventory.push(pull);

    pullBox.innerText = `${pull.name} (${pull.rarity})`;
    updateCoins();
    renderInventory();
    save();
}

function openFive() {
    if (coins < 500) {
        pullBox.innerText = "Not enough coins!";
        return;
    }

    coins -= 500;

    let results = "";

    for (let i = 0; i < 5; i++) {
        let rarity = pickRarity();
        let player = getRandomPlayer(players.nba);

        let pull = {
            name: player,
            rarity: rarity.name,
            value: rarity.value,
            fav: false
        };

        inventory.push(pull);
        results += `${pull.name} (${pull.rarity})\n`;
    }

    pullBox.innerText = results;
    updateCoins();
    renderInventory();
    save();
}

// ----- DAILY REWARD -----

function claimDaily() {
   
