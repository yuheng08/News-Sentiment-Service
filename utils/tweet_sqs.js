const AWS = require('aws-sdk');
const { TWEET_QUEUE_URL, queueReadParams } = require('../config/config.js');
AWS.config.loadFromPath('config/config.json');
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const getFormattedAttributes = function ({ timestamp, geolocation }) {
  return {
    timestamp: {
      DataType: 'String',
      StringValue: timestamp
    },
    geolocation: {
      DataType: 'String',
      StringValue: geolocation
    }
  };
};

const enqueueTweet = function (tweet) {
  const queueWriteParams = {
    MessageBody: tweet.text,
    QueueUrl: TWEET_QUEUE_URL,
    MessageAttributes: getFormattedAttributes(tweet)
  };

  sqs.sendMessage(queueWriteParams, function (err, data) {
    if (err) {
      console.log('Error', err);
    }
  });
};

const dequeueTweets = function (callback) {
  sqs.receiveMessage(queueReadParams, function (err, data) {
    if (err) {
      console.log('Receive Error', err);
    } else {
      callback(data.Messages);
      data.Messages.forEach(message => deleteFromQueue(message));
    }
  });
};

const deleteFromQueue = function (message) {
  const deleteParams = {
    QueueUrl: TWEET_QUEUE_URL,
    ReceiptHandle: message.ReceiptHandle
  };

  sqs.deleteMessage(deleteParams, function (err, data) {
    if (err) {
      console.log('Delete error', err);
    }
  });
};

module.exports = {
  enqueueTweet,
  dequeueTweets
};