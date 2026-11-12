module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Player',
    {
      player_id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      session_id: { type: DataTypes.BIGINT, allowNull: false },
      user_id: { type: DataTypes.BIGINT, allowNull: false },
      nickname: { type: DataTypes.STRING(30), allowNull: false },
      player_color: { type: DataTypes.STRING(10), allowNull: false },
      token: { type: DataTypes.STRING(255), allowNull: false, unique: true },
      score: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      streak: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      device_platform: { type: DataTypes.STRING(20) },
    },
    { tableName: 'players', timestamps: true, createdAt: 'joined_at', updatedAt: false }
  );