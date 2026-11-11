// Thin: read the validated input, call one service function, pick the status.
const { matchedData } = require('express-validator');
const playerService = require('../services/player.service');

// Nickname, color and score only. Never the school ID, name, email or token.
function toJson(player) {
  return {
    player_id: Number(player.player_id),
    nickname: player.nickname,
    player_color: player.player_color,
    score: player.score,
  };
}

async function join(req, res) {
  const { code, nickname } = matchedData(req);
  const { session, player, created } = await playerService.join(code, nickname, req.user);
  // 201 Created for a new seat, 200 OK when the account already had one.
  res.status(created ? 201 : 200).json({
    ...toJson(player),
    rejoined: !created,
    session: { code: session.join_code, status: session.status },
  });
}

async function list(req, res) {
  const { code } = matchedData(req, { locations: ['params'] });
  const players = await playerService.list(code);
  res.status(200).json(players.map(toJson));
}

module.exports = { join, list };