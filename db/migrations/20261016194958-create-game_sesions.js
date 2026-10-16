'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('game_sessions', {
      session_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      host_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'hosts', key: 'host_id' },
        onDelete: 'CASCADE'
      },
      set_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'question_sets', key: 'set_id' },
        onDelete: 'CASCADE'
      },
      grid_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
        references: { model: 'crossword_grids', key: 'grid_id' },
        onDelete: 'CASCADE'
      },
      join_code: {
        type: Sequelize.CHAR(6),
        allowNull: false,
        unique: true
      },
      shareable_link: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'WAITING'
      },
      started_at: {
        type: Sequelize.DATE
      },
      ended_at: {
        type: Sequelize.DATE
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('game_sesions');
  }
};
