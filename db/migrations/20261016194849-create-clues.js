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
    await queryInterface.createTable('clues', {
      clue_id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        references: { model: 'clues', key: 'clue_id' },
        onDelete: 'CASCADE'
      },
      set_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'question_sets',
          key: 'set_id'
        },
        onDelete: 'CASCADE' // optional, but matches good foreign key habits
      },
      direction: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      start_row: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      start_col: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      clue_text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      answer_text: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      answer_length: {
        type: Sequelize.INTEGER,
        allowNull: false
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
    await queryInterface.dropTable('clues');
  }
};
