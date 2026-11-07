'use strict';

const JOIN_CODE = '731594';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    const db = queryInterface.sequelize;

    const [[session]] = await db.query(`SELECT session_id FROM game_sessions WHERE join_code = '${JOIN_CODE}'`);
    const [players] = await db.query(`SELECT player_id, nickname FROM players WHERE session_id = ${session.session_id}`);
    const [clues] = await db.query('SELECT clue_id, answer_text FROM clues');

    const pid = (nickname) => players.find((p) => p.nickname === nickname).player_id;
    const cid = (answer) => clues.find((c) => c.answer_text === answer).clue_id;

    // Each clue is solved once per session (UNIQUE session_id + clue_id).
    await queryInterface.bulkInsert('solved_words', [
      { player_id: pid('Rina'), session_id: session.session_id, clue_id: cid('LIBRARY'), points_awarded: 100, solved_at: new Date('2026-10-16T10:02:00Z') },
      { player_id: pid('Rina'), session_id: session.session_id, clue_id: cid('BORROW'), points_awarded: 90, solved_at: new Date('2026-10-16T10:05:00Z') },
      { player_id: pid('Dale'), session_id: session.session_id, clue_id: cid('BOOK'), points_awarded: 80, solved_at: new Date('2026-10-16T10:07:00Z') },
      { player_id: pid('Dale'), session_id: session.session_id, clue_id: cid('SHELF'), points_awarded: 60, solved_at: new Date('2026-10-16T10:10:00Z') },
      { player_id: pid('Pao'), session_id: session.session_id, clue_id: cid('READER'), points_awarded: 70, solved_at: new Date('2026-10-16T10:12:00Z') }
    ]);
  },

  async down (queryInterface) {
    const db = queryInterface.sequelize;
    const [rows] = await db.query(`SELECT session_id FROM game_sessions WHERE join_code = '${JOIN_CODE}'`);
    if (rows.length > 0) {
      await queryInterface.bulkDelete('solved_words', { session_id: rows[0].session_id }, {});
    }
  }
};