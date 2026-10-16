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
    await queryInterface.createTable('players', {
      player_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      session_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'game_sesions', key: 'session_id' },
        onDelete: 'CASCADE'
      },
      nickname: {
        type: Sequelize.STRING(30),
        allowNull: false
      },
      player_color: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      token: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      streak: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      device_platform: {
        type: Sequelize.STRING(20)
      },
      joined_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
      }
    });

    // Adding the composite unique constraints (matching your SQL definition)
    await queryInterface.addConstraint('players', {
      type: 'unique',
      fields: ['session_id', 'nickname'],
      name: 'unique_session_nickname'
    });

    await queryInterface.addConstraint('players', {
      type: 'unique',
      fields: ['session_id', 'player_color'],
      name: 'unique_session_color'
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.dropTable('players');
  }
};
