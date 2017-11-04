const AWS = require('aws-sdk');
const { QUEUE_URL, queueReadParams } = require('../config/config.js');
AWS.config.loadFromPath('config/sqs.json');
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

const sendToQueue = function (tweet) {
  const queueWriteParams = {
    MessageBody: tweet.text,
    QueueUrl: QUEUE_URL,
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
      callback(data.Messages);
      data.Messages.forEach(message => deleteFromQueue(message));
    }
  });
};

const deleteFromQueue = function (message) {
  const deleteParams = {
    QueueUrl: QUEUE_URL,
    ReceiptHandle: message.ReceiptHandle
  };

  sqs.deleteMessage(deleteParams, function (err, data) {
    if (err) {
      console.log('Delete error', err);
    } else {
      console.log('Message deleted', data);
    }
  });
};

module.exports = {
  sendToQueue,
  getFromQueue
};