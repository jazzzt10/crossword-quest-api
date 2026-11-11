// The only file that queries game_sessions. No rules here.
const { sequelize, GameSession, CrosswordGrid } = require('../models');

function findByCode(code) {
  return GameSession.findOne({ where: { join_code: code } });
}

// A session needs its own grid (grid_id is NOT NULL and UNIQUE),
// so both rows are saved together or not at all.
function createWithGrid(data) {
  return sequelize.transaction(async (t) => {
    const grid = await CrosswordGrid.create({}, { transaction: t });
    return GameSession.create({ ...data, grid_id: grid.grid_id }, { transaction: t });
  });
}

function update(session, changes) {
  return session.update(changes);
}

module.exports = { findByCode, createWithGrid, update };