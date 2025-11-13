const basePlayers = {
  NBA: [
    { name: 'LeBron James', rarity: 'legendary', image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png' },
    { name: 'Stephen Curry', rarity: 'epic', image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png' },
    { name: 'Joel Embiid', rarity: 'epic', image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/203954.png' },
    { name: 'Luka Doncic', rarity: 'rare', image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1629029.png' },
    { name: 'Jayson Tatum', rarity: 'rare', image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1628369.png' },
    { name: 'Victor Wembanyama', rarity: 'legendary', image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1630163.png' },
    { name: 'LaMelo Ball', rarity: 'epic', image: 'https://cdn.nba.com/headshots/nba/latest/1040x760/1630161.png' }
  ],
  NBL: [
    { name: 'Bryce Cotton', rarity: 'legendary', image: 'https://media.nbl.com.au/photos/players/1170.png' },
    { name: 'Tyler Harvey', rarity: 'epic', image: 'https://media.nbl.com.au/photos/players/1400.png' },
    { name: 'Chris Goulding', rarity: 'rare', image: 'https://media.nbl.com.au/photos/players/1032.png' },
    { name: 'Nathan Sobey', rarity: 'common', image: 'https://media.nbl.com.au/photos/players/1230.png' },
    { name: 'Admiral Schofield', rarity: 'common', image: 'https://media.nbl.com.au/photos/players/1501.png' },
    { name: 'Jaylen Adams', rarity: 'common', image: 'https://media.nbl.com.au/photos/players/1450.png' },
    { name: 'Jack McVeigh', rarity: 'common', image: 'https://media.nbl.com.au/photos/players/1600.png' }
  ],
  AFL: [
    { name: 'Dustin Martin', rarity: 'legendary', image: 'https://resources.afl.com.au/photo-resources/2023/03/08/e2848dfa-ae7a-4bcd-8b05-21978b5de29b/Dustin-Martin.png?width=800&height=800' },
    { name: 'Nat Fyfe', rarity: 'rare', image: 'https://resources.afl.com.au/photo-resources/2023/03/08/2cdf97ce-64b5-4eb2-9c63-7d6dd5f64639/Nat-Fyfe.png?width=800&height=800' },
    { name: 'Patrick Voss', rarity: 'epic', image: 'https://resources.afl.com.au/photo-resources/2023/03/08/placeholder.png' },
    { name: 'Marcus Bontempelli', rarity: 'epic', image: 'https://resources.afl.com.au/photo-resources/2023/03/08/placeholder.png' },
    { name: 'Nick Daicos', rarity: 'rare', image: 'https://resources.afl.com.au/photo-resources/2023/03/08/placeholder.png' },
    { name: 'Lachie Neale', rarity: 'rare', image: 'https://resources.afl.com.au/photo-resources/2023/03/08/placeholder.png' },
    { name: 'Murphy Reid', rarity: 'rare', image: 'https://resources.afl.com.au/photo-resources/2023/03/08/placeholder.png' }
  ],
  Soccer: [
    { name: 'Erling Haaland', rarity: 'legendary', image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p223094.png' },
    { name: 'Mohamed Salah', rarity: 'epic', image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p118748.png' },
    { name: 'Kevin De Bruyne', rarity: 'epic', image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p61366.png' },
    { name: 'Martin Ødegaard', rarity: 'epic', image: 'https://resources.premierleague.com/premierleague/photos/250x250/p229145.png' },
    { name: 'Alisson Becker', rarity: 'epic', image: 'https://resources.premierleague.com/premierleague/photos/250x250/p10058.png' },
    { name: 'Virgil Van Dijk', rarity: 'epic', image: 'https://resources.premierleague.com/premierleague/photos/250x250/p9872.png' },
    { name: 'Son Heung-min', rarity: 'epic', image: 'https://resources.premierleague.com/premierleague/photos/players/250x250/p14857.png' }
  ]
};
