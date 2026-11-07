// Hub Contract rule 7: one row per player per FINISHED game.
// "completed" rule (also write this in the README): a player completed the
// game if they solved at least one word in it.
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

async function findFinishedGamePlayers(since) {
  const sql = `
    SELECT s.join_code AS session_code, s.started_at, s.ended_at,
           u.school_id, p.nickname, p.score,
           EXISTS (
             SELECT 1 FROM solved_words sw WHERE sw.player_id = p.player_id
           ) AS completed
    FROM game_sessions s
    JOIN players p ON p.session_id = s.session_id
    JOIN users u ON u.user_id = p.user_id
    WHERE s.status = 'FINISHED'
      AND (CAST(:since AS timestamptz) IS NULL OR s.ended_at > CAST(:since AS timestamptz))
    ORDER BY s.ended_at, p.score DESC
  `;

  return sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements: { since: since ? since.toISOString() : null },
  });
}

module.exports = { findFinishedGamePlayers };