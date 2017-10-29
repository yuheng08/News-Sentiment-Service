const Sequelize = require('sequelize');
const sequelize = require('../sequelize');

const Team = sequelize.define('team', {
  name: {
    type: Sequelize.STRING
  }
},
{
  timestamps: false
});

module.exports = Team;
