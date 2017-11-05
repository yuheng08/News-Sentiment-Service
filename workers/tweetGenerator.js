const neatCsv = require('neat-csv');
const PD = require('probability-distributions');
const fs = require('fs');

const ROSTER_PATH = 'resources/players.csv';
const sentiments = ['terrible', 'bad', 'okay', 'good', 'great'];
const mapping = {
  terrible: -1,
  bad: -0.5,
  okay: 0,
  good: 0.5,
  great: 1
};

const betaRandom = function () {
}

const getRandomPlayer = function (players) {
  const randomNumber = PD.rbeta(1, .9, 4)[0];
  return players[Math.floor(randomNumber * players.length)];
};

const populateRoster = function () {
   return neatCsv(fs.createReadStream(ROSTER_PATH));
};

const sendTweet = function (tweet) {
  
};

const generateTweet = async function () {
  const roster = await populateRoster();
  const player = getRandomPlayer(roster);
  console.log(player);
};

generateTweet();