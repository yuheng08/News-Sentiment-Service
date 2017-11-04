const AWS = require('aws-sdk');
const { queueURL, queueReadParams } = require('../config/config.js');
AWS.config.loadFromPath('config/sqs.json');
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const getFormattedAttributes = function ({ text, timestamp, geolocation }) {
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

const sendToQueue = function (tweet) {
  const queueWriteParams = {
    MessageBody: tweet.text,
    QueueUrl: queueURL,
    MessageAttributes: getFormattedAttributes(tweet)
  };

  sqs.sendMessage(queueWriteParams, function (err, data) {
    if (err) {
      console.log('Error', err);
    } else {
      console.log('Success', data.MessageId);
    }
  });
};

const getFromQueue = function (callback) {
  sqs.receiveMessage(queueReadParams, function (err, data) {
    if (err) {
      console.log('Receive Error', err);
    } else {
      callback(data);
    }
  });
};

getFromQueue(data => console.log(data));

module.exports = {
  sendToQueue,
  getFromQueue
};