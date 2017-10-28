const Sequelize = require('sequelize');
const sequelize = require('../sequelize');

const Tweet = sequelize.define('tweet', {
  text: {
    type: Sequelize.STRING
  },
  timestamp: {
    type: Sequelize.DATE
  },
  geolocation: {
    type: Sequelize.GEOMETRY('POINT')
  }
});

module.exports = Tweet;