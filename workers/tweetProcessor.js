const cluster = require('cluster');
const { dequeueTweets } = require('../utils/tweet_sqs.js');

const createWorkers = function () {
  const numCPUs = require('os').cpus().length;
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
};

const processTweets = function () {
  dequeueTweets(function (tweets) {
    tweets.forEach(tweet => console.log(tweet));
  });
};

if (cluster.isMaster) {
  createWorkers();
} else {
  processTweets();
}