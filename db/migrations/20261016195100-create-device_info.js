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
    await queryInterface.createTable('device_info', {
      device_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      player_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'players', key: 'player_id' },
        onDelete: 'CASCADE'
      },
      platform: {
        type: Sequelize.STRING(20)
      },
      browser: {
        type: Sequelize.STRING(50)
      },
      last_seen: {
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
    await queryInterface.dropTable('device_info');
  }
};
