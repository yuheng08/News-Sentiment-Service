const cluster = require('cluster');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { enqueueTweet } = require('../utils/tweet_sqs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/tweets', function (req, res) {
  res.end();
  enqueueTweet(req.body);
});

app.listen(PORT, function () {
  console.log(`${process.pid} is listening on port ${PORT}!`);
});