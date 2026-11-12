module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'GameSession',
    {
      session_id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      host_id: { type: DataTypes.BIGINT, allowNull: false },
      set_id: { type: DataTypes.BIGINT, allowNull: false },
      grid_id: { type: DataTypes.BIGINT, allowNull: false },
      join_code: { type: DataTypes.CHAR(6), allowNull: false, unique: true },
      shareable_link: { type: DataTypes.STRING(255), allowNull: false },
      status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'WAITING' },
      started_at: { type: DataTypes.DATE },
      ended_at: { type: DataTypes.DATE },
    },
    { tableName: 'game_sessions', timestamps: true, createdAt: 'created_at', updatedAt: false }
  );