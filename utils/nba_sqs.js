const AWS = require('aws-sdk');
const { NBA_QUEUE_URL, queueReadParams } = require('../config/config.js');
AWS.config.loadFromPath('config/config.json');
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const getFormattedAttributes = function (sentiments) {
  let messageAttributes = {};

  for (let player in sentiments) {
    messageAttributes[player] = {
      DataType: 'Number',
      StringValue: sentiments[player] + ''
    };
  }

  console.log(messageAttributes);
  return messageAttributes;
};

const enqueueSentiments = function (sentiments) {
  const queueWriteParams = {
    MessageBody: JSON.stringify(sentiments),
    QueueUrl: NBA_QUEUE_URL
  };

  sqs.sendMessage(queueWriteParams, function (err, data) {
    if (err) {
      console.log('Error', err);
    } else {
      console.log('Success', data.MessageId);
    }
  });
};

module.exports = {
  getFormattedAttributes,
  enqueueSentiments
};
