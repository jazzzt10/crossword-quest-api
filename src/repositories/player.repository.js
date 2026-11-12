// The only file that queries players. No rules here.
const { Player } = require('../models');

// The seat of one account in one session, or null. This one query is the rejoin rule.
function findSeat(sessionId, userId) {
  return Player.findOne({ where: { session_id: sessionId, user_id: userId } });
}

function countBySession(sessionId) {
  return Player.count({ where: { session_id: sessionId } });
}

async function findColorsInUse(sessionId) {
  const rows = await Player.findAll({ attributes: ['player_color'], where: { session_id: sessionId } });
  return rows.map((row) => row.player_color);
}

function listBySession(sessionId) {
  return Player.findAll({
    where: { session_id: sessionId },
    order: [['score', 'DESC'], ['nickname', 'ASC']],
  });
}

function create(data) {
  return Player.create(data);
}

module.exports = { findSeat, countBySession, findColorsInUse, listBySession, create };