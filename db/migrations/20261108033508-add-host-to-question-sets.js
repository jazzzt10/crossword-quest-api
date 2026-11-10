'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('question_sets', 'host_id', {
      type: Sequelize.BIGINT,
      allowNull: false,
      references: { model: 'users', key: 'user_id' },
      onDelete: 'CASCADE'
    });
  },

  async down (queryInterface) {
    await queryInterface.removeColumn('question_sets', 'host_id');
  }
};