// The rules of joining a game. No req, no res, no queries here.
const crypto = require('crypto');
const gameInfo = require('../config/game-info');
const sessionService = require('./session.service');
const playerRepository = require('../repositories/player.repository');
const { conflict } = require('../errors/app-error');
const { constraintOf } = require('../errors/db-errors');

// One color for each of the six seats.
const COLORS = ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE'];

async function join(code, nickname, user) {
  const session = await sessionService.findOrFail(code);

  // Rejoin: this account already has a seat here. Same row, same score.
  const seat = await playerRepository.findSeat(session.session_id, user.user_id);
  if (seat) return { session, player: seat, created: false };

  // A new seat: only while the game is waiting, and only if there is room.
  if (session.status === 'FINISHED') throw conflict('SESSION_ENDED', 'This game has ended.');
  if (session.status !== 'WAITING') throw conflict('SESSION_NOT_JOINABLE', 'This game has already started.');

  const seatsTaken = await playerRepository.countBySession(session.session_id);
  if (seatsTaken >= gameInfo.max_players) throw conflict('SESSION_FULL', 'This game is full.');

  // The server picks the first color nobody uses yet, and makes the token.
  const used = await playerRepository.findColorsInUse(session.session_id);
  const color = COLORS.find((candidate) => !used.includes(candidate));

  try {
    const player = await playerRepository.create({
      session_id: session.session_id,
      user_id: user.user_id,
      nickname,
      player_color: color,
      token: crypto.randomBytes(24).toString('hex'),
    });
    return { session, player, created: true };
  } catch (error) {
    // The same account sent two joins at the same instant. UNIQUE (session_id, user_id)
    // stopped a second seat, so return the seat that exists.
    if (constraintOf(error) === 'uq_one_seat') {
      const existing = await playerRepository.findSeat(session.session_id, user.user_id);
      return { session, player: existing, created: false };
    }
    throw error; // a taken nickname reaches the error handler and answers 409
  }
}

async function list(code) {
  const session = await sessionService.findOrFail(code);
  return playerRepository.listBySession(session.session_id);
}

module.exports = { join, list };