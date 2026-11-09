'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.removeConstraint('game_sessions', 'game_sessions_set_id_fkey');
    await queryInterface.addConstraint('game_sessions', {
      fields: ['set_id'],
      type: 'foreign key',
      name: 'game_sessions_set_id_fkey',
      references: { table: 'question_sets', field: 'set_id' },
      onDelete: 'NO ACTION'
    });
  },

  async down (queryInterface) {
    await queryInterface.removeConstraint('game_sessions', 'game_sessions_set_id_fkey');
    await queryInterface.addConstraint('game_sessions', {
      fields: ['set_id'],
      type: 'foreign key',
      name: 'game_sessions_set_id_fkey',
      references: { table: 'question_sets', field: 'set_id' },
      onDelete: 'CASCADE'
    });
  }
};