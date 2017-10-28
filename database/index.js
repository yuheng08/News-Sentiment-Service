const Player = require('./models/player.js');
const Team = require('./models/team.js');
const Tweet = require('./models/tweet.js');

Team.hasMany(Player, { foreignKey: 'teamid' });
Player.belongsTo(Team, { foreignKey: 'teamid'});
Player.hasMany(Tweet, { foreignKey: 'playerid' });
Tweet.belongsTo(Player, { foreignKey: 'playerid' });

module.exports = {
  Player,
  Team,
  Tweet
};
