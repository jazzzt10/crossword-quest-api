'use strict';

const bcrypt = require('bcryptjs');

// One demo password for every seeded account. Write it in the README.
// It needs 8 to 72 characters, with a letter and a number.
const DEMO_PASSWORD = 'Crossword-Demo-2026';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    const hash = await bcrypt.hash(DEMO_PASSWORD, 10);
    // Only accounts that have no password yet. A second run changes nothing.
    await queryInterface.bulkUpdate('users', { password_hash: hash }, { password_hash: null });
  },

  async down (queryInterface) {
    await queryInterface.bulkUpdate('users', { password_hash: null }, {});
  }
};