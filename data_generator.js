var fs = require('fs');
var csv = require('fast-csv');

var sentiments = ['terrible', 'bad', 'okay', 'good', 'great'];
var numTweets = 5000000;

var ROSTER_PATH = 'players.csv';
var TWEETS_PATH = 'tweets.csv';

var createTweets = function () {
  getPlayersFromRoster(function (playersArray) {
    generateTweets(playersArray);
  });
};

var getPlayersFromRoster = function (callback) {
  var players = [];
  var data = fs.readFileSync(ROSTER_PATH, 'utf8');

  csv.fromString(data, { headers: false })
    .on('data', function (data) {
      players.push(data[0]);
    })
    .on('end', function () {
      callback(players);
    });
};

var generateTweets = function (players) {
  var tweets = Array(numTweets).fill(1).map(() =>
    players[Math.floor(Math.random() * players.length)] + ' is ' + sentiments[Math.floor(Math.random() * sentiments.length)]);

  fs.appendFile(TWEETS_PATH, tweets.join('\n'), function (err) {
    if (err) {
      throw err;
    }

    console.log(`Saved ${numTweets}!`);
  });
};

createTweets();