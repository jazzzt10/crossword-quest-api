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
    await queryInterface.createTable('solved_words', {
      id: {
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
      points_awarded: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      solved_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now')
      }
    });

    // Adding the composite unique constraint for session_id and clue_id
    await queryInterface.addConstraint('solved_words', {
      type: 'unique',
      fields: ['session_id', 'clue_id'],
      name: 'unique_session_clue'
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     await queryInterface.dropTable('solved_words');
  }
};
