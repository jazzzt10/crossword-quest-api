'use strict';

const SCHOOL_IDS = ['2099-0001', '2099-0002', '2099-1001', '2099-1002', '2099-1003', '2099-1004', '2099-0003'];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert('users', [
      { school_id: '2099-0001', full_name: 'Maria Host Santos', email: 'maria.santos@crosswordquest.test', role: 'HOST' },
      { school_id: '2099-0002', full_name: 'Admin Demo', email: 'admin.demo@crosswordquest.test', role: 'ADMIN' },
      { school_id: '2099-1001', full_name: 'Rina Dela Cruz', email: 'rina.delacruz@crosswordquest.test', role: 'PLAYER' },
      { school_id: '2099-1002', full_name: 'Dale Reyes', email: 'dale.reyes@crosswordquest.test', role: 'PLAYER' },
      { school_id: '2099-1003', full_name: 'Pao Garcia', email: 'pao.garcia@crosswordquest.test', role: 'PLAYER' },
      // Awkward case on purpose: an account that never joins a game.
      { school_id: '2099-1004', full_name: 'Bea Lopez', email: 'bea.lopez@crosswordquest.test', role: 'PLAYER' },
      // A second host, to test that one host cannot touch another host's sets.
      { school_id: '2099-0003', full_name: 'Ben Castro', email: 'ben.castro@crosswordquest.test', role: 'HOST' }
    ]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('users', { school_id: SCHOOL_IDS }, {});
  }
};