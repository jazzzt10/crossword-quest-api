module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'CrosswordGrid',
    {
      grid_id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      size: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 },
    },
    { tableName: 'crossword_grids', timestamps: false }
  );