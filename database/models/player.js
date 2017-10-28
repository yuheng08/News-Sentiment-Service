const Sequelize = require('sequelize');
const sequelize = require('../sequelize');

const Player = sequelize.define('player', {
  name: {
    type: Sequelize.STRING
  }
},
{
  timestamps: false
});

module.exports = Player;