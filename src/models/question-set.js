module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'QuestionSet',
    {
      set_id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      host_id: { type: DataTypes.BIGINT, allowNull: false },
      name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    },
    { tableName: 'question_sets', timestamps: true, createdAt: 'created_at', updatedAt: false }
  );