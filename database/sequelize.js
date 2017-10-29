const Sequelize = require('sequelize');

const sequelize = new Sequelize('nbatweets', '', '', {
  host: process.env.DATABASE_URL || 'localhost',
  dialect: 'postgres'
});

sequelize
  .authenticate()
  .then(() => {
    sequelize.sync();
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;