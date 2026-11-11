// ONE Sequelize instance (one connection pool) for the whole API.
// Every other file imports it from here - nobody opens a second one.
const { Sequelize, DataTypes } = require('sequelize');
const env = require('../config/env');
const dbConfig = require('../config/database')[env.nodeEnv];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

// Week 11: load your models here, one line each, then add their associations.
// Example:
//   const User = require('./user')(sequelize, DataTypes);
//   const Player = require('./player')(sequelize, DataTypes);
//   User.hasMany(Player, { foreignKey: 'user_id' });
//   Player.belongsTo(User, { foreignKey: 'user_id' });

const User = require('./user')(sequelize, DataTypes);
const QuestionSet = require('./question-set')(sequelize, DataTypes);
User.hasMany(QuestionSet, { foreignKey: 'host_id' });
QuestionSet.belongsTo(User, { foreignKey: 'host_id', as: 'host' });

const CrosswordGrid = require('./crossword-grid')(sequelize, DataTypes);
const GameSession = require('./game-session')(sequelize, DataTypes);
const Player = require('./player')(sequelize, DataTypes);

GameSession.belongsTo(User, { foreignKey: 'host_id', as: 'host' });
GameSession.belongsTo(QuestionSet, { foreignKey: 'set_id' });
GameSession.belongsTo(CrosswordGrid, { foreignKey: 'grid_id' });
GameSession.hasMany(Player, { foreignKey: 'session_id' });
Player.belongsTo(GameSession, { foreignKey: 'session_id' });
Player.belongsTo(User, { foreignKey: 'user_id' });

module.exports = { sequelize, Sequelize, DataTypes, User, QuestionSet, CrosswordGrid, GameSession, Player };