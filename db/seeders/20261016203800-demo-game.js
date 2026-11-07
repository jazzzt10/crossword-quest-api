'use strict';

const JOIN_CODE = '731594';
const SET_NAME = 'Library Orientation Basics';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    const db = queryInterface.sequelize;

    // 1. Find the host account that demo-users created.
    const [[host]] = await db.query("SELECT user_id FROM users WHERE school_id = '2099-0001'");

    // 2. Question set, then its clues.
    await queryInterface.bulkInsert('question_sets', [{ name: SET_NAME }]);
    const [[set]] = await db.query(`SELECT set_id FROM question_sets WHERE name = '${SET_NAME}'`);

    await queryInterface.bulkInsert('clues', [
      { set_id: set.set_id, direction: 'ACROSS', start_row: 0, start_col: 0, clue_text: 'A building full of books you can borrow', answer_text: 'LIBRARY', answer_length: 7 },
      { set_id: set.set_id, direction: 'DOWN', start_row: 0, start_col: 2, clue_text: 'Take a book home for a while', answer_text: 'BORROW', answer_length: 6 },
      { set_id: set.set_id, direction: 'ACROSS', start_row: 1, start_col: 1, clue_text: 'You read this, and it has pages', answer_text: 'BOOK', answer_length: 4 },
      { set_id: set.set_id, direction: 'ACROSS', start_row: 2, start_col: 2, clue_text: 'A person who reads', answer_text: 'READER', answer_length: 6 },
      { set_id: set.set_id, direction: 'DOWN', start_row: 4, start_col: 6, clue_text: 'Where books are placed in a row', answer_text: 'SHELF', answer_length: 5 }
    ]);

    // 3. Grid, then a finished game session that uses both.
    await queryInterface.bulkInsert('crossword_grids', [{ size: 10 }]);
    const [[grid]] = await db.query('SELECT grid_id FROM crossword_grids ORDER BY grid_id DESC LIMIT 1');

    await queryInterface.bulkInsert('game_sessions', [{
      host_id: host.user_id,
      set_id: set.set_id,
      grid_id: grid.grid_id,
      join_code: JOIN_CODE,
      shareable_link: `http://localhost:3001/join/${JOIN_CODE}`,
      status: 'FINISHED',
      started_at: new Date('2026-10-16T10:00:00Z'),
      ended_at: new Date('2026-10-16T10:15:00Z')
    }]);
    const [[session]] = await db.query(`SELECT session_id FROM game_sessions WHERE join_code = '${JOIN_CODE}'`);

    // 4. Three players, each tied to an account (one seat per account).
    const [users] = await db.query("SELECT user_id, school_id FROM users WHERE school_id IN ('2099-1001','2099-1002','2099-1003')");
    const idOf = (schoolId) => users.find((u) => u.school_id === schoolId).user_id;

    await queryInterface.bulkInsert('players', [
      { session_id: session.session_id, user_id: idOf('2099-1001'), nickname: 'Rina', player_color: 'RED', token: 'demo-token-rina', score: 190, streak: 2, device_platform: 'ANDROID', joined_at: new Date('2026-10-16T09:58:00Z') },
      { session_id: session.session_id, user_id: idOf('2099-1002'), nickname: 'Dale', player_color: 'BLUE', token: 'demo-token-dale', score: 140, streak: 2, device_platform: 'WINDOWS', joined_at: new Date('2026-10-16T09:58:30Z') },
      { session_id: session.session_id, user_id: idOf('2099-1003'), nickname: 'Pao', player_color: 'GREEN', token: 'demo-token-pao', score: 70, streak: 1, device_platform: 'IOS', joined_at: new Date('2026-10-16T09:59:00Z') }
    ]);

    // 5. One device row per player.
    const [players] = await db.query(`SELECT player_id, nickname FROM players WHERE session_id = ${session.session_id}`);
    const pid = (nickname) => players.find((p) => p.nickname === nickname).player_id;

    await queryInterface.bulkInsert('device_info', [
      { player_id: pid('Rina'), platform: 'ANDROID', browser: 'Chrome' },
      { player_id: pid('Dale'), platform: 'WINDOWS', browser: 'Edge' },
      { player_id: pid('Pao'), platform: 'IOS', browser: 'Safari' }
    ]);
  },

  async down (queryInterface) {
    const db = queryInterface.sequelize;
    // Deleting the grid removes the session, players and device rows (ON DELETE CASCADE).
    const [rows] = await db.query(`SELECT grid_id FROM game_sessions WHERE join_code = '${JOIN_CODE}'`);
    if (rows.length > 0) {
      await queryInterface.bulkDelete('crossword_grids', { grid_id: rows[0].grid_id }, {});
    }
    await queryInterface.bulkDelete('question_sets', { name: SET_NAME }, {});
  }
};