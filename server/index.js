const cluster = require('cluster');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { enqueueTweet } = require('../utils/tweet_sqs');

const PORT = process.env.PORT || 3000;

const createWorkers = function () {
  const numCPUs = require('os').cpus().length;

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
};

const handleRequests = function () {
  const app = express();

  app.use(morgan('tiny'));
  app.use(bodyParser.json());

  app.post('/tweets', function (req, res) {
    enqueueTweet(req.body);
    res.end();
  });

  app.listen(PORT, function () {
    console.log(`${process.pid} is listening on port ${PORT}!`);
  });
};

if (cluster.isMaster) {
  createWorkers();
} else {
  handleRequests();
}

