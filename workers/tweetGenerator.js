const neatCsv = require('neat-csv');
const PD = require('probability-distributions');
const fs = require('fs');
const axios = require('axios');
const { enqueueSentiments } = require('../utils/nba_sqs.js');

var roster = [];
const ROSTER_PATH = 'resources/players.csv';
const sentiments = ['terrible', 'bad', 'okay', 'good', 'great'];
const mapping = {
  terrible: -1,
  bad: -0.5,
  okay: 0,
  good: 0.5,
  great: 1
};

const getRandomPlayer = function (players) {
  const randomNumber = PD.rbeta(1, .9, 4)[0];
  return players[Math.floor(randomNumber * players.length)];
};

const getRandomSentiment = function () {
  return sentiments[Math.floor(Math.random() * sentiments.length)];
};

var generateRandomGeolocation = function() {
  var latUpperBound = 48.987386;
  var latLowerBound = 18.005611;
  var longUpperBound = -62.361014;
  var longLowerBound = -124.626080;

  var randLat = Math.random() * (latUpperBound - latLowerBound + 1) + latLowerBound;
  var randLong = Math.random() * (longUpperBound - longLowerBound + 1) + longLowerBound;
  var roundedLat = randLat.toFixed(6);
  var roundedLong = randLong.toFixed(6);

  return `${roundedLat},${roundedLong}`;
};

const getRoster = function () {
   return neatCsv(fs.createReadStream(ROSTER_PATH));
};

const sendTweet = function (tweet) {
  axios({
    method: 'post',
    url: process.env.REQUEST_SERVER_URL || 'http://localhost:8080/tweets',
    data: tweet
  });
};

const generateTweet = function (roster) {
  const player = getRandomPlayer(roster).name;
  const hashTag = '#' + player.toLowerCase().replace(' ', '');
  const timestamp = new Date().toISOString();
  const geolocation = generateRandomGeolocation();
  const sentiment = getRandomSentiment();
  const text = `${player} is ${sentiment} ${hashTag}`;

  return {
    text,
    timestamp,
    geolocation
  };
};

const startGeneration = async function () {
  const roster = await getRoster();

  setInterval(() => {
    let tweet = generateTweet(roster);
    sendTweet(tweet);
  }, 1000);
};

startGeneration();