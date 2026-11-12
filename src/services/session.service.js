// The rules of a game session. No req, no res, no queries here.
const env = require('../config/env');
const gameInfo = require('../config/game-info');
const sessionRepository = require('../repositories/session.repository');
const playerRepository = require('../repositories/player.repository');
const questionSetRepository = require('../repositories/question-set.repository');
const { notFound, forbidden, conflict } = require('../errors/app-error');
const { constraintOf } = require('../errors/db-errors');

// Rule: which status may follow which.
const NEXT_STATUS = {
  WAITING: ['PLAYING', 'FINISHED'],
  PLAYING: ['FINISHED'],
  FINISHED: [],
};

// Hub Contract rule 5: six digits. 100000 to 999999 never starts with 0.
function randomCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function findOrFail(code) {
  const session = await sessionRepository.findByCode(code);
  if (!session) {
    throw notFound('SESSION_NOT_FOUND', `No game has the code ${code}.`);
  }
  return session;
}

// Number(): PostgreSQL BIGINT can arrive as text, so compare as numbers.
function isHost(session, user) {
  return Number(session.host_id) === Number(user.user_id) || user.role === 'ADMIN';
}

async function create(setId, user) {
  const questionSet = await questionSetRepository.findById(setId);
  if (!questionSet) {
    throw notFound('QUESTION_SET_NOT_FOUND', `No question set has the id ${setId}.`);
  }
  const mayUse = Number(questionSet.host_id) === Number(user.user_id) || user.role === 'ADMIN';
  if (!mayUse) throw forbidden('This question set belongs to another host.');

  // A random code can already be in use. The UNIQUE rule on join_code tells us, and we try again.
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const code = randomCode();
    try {
      return await sessionRepository.createWithGrid({
        host_id: user.user_id,
        set_id: questionSet.set_id,
        join_code: code,
        shareable_link: `http://localhost:${env.port}/join/${code}`,
      });
    } catch (error) {
      if (constraintOf(error) !== 'game_sessions_join_code_key') throw error;
    }
  }
  throw new Error('Could not find a free join code after 5 attempts.');
}

async function get(code) {
  const session = await findOrFail(code);
  const playerCount = await playerRepository.countBySession(session.session_id);
  return { session, playerCount };
}

async function changeStatus(code, status, user) {
  const session = await findOrFail(code);
  if (!isHost(session, user)) throw forbidden('This game belongs to another host.');

  if (!NEXT_STATUS[session.status].includes(status)) {
    throw conflict('INVALID_STATUS_CHANGE', `A ${session.status} game cannot become ${status}.`);
  }

  if (status === 'PLAYING') {
    const seats = await playerRepository.countBySession(session.session_id);
    if (seats < gameInfo.min_players) {
      throw conflict('NOT_ENOUGH_PLAYERS', `At least ${gameInfo.min_players} players must join before the game can start.`);
    }
  }

  const changes = { status };
  if (status === 'PLAYING') changes.started_at = new Date();
  if (status === 'FINISHED') changes.ended_at = new Date();
  return sessionRepository.update(session, changes);
}

module.exports = { create, get, changeStatus, findOrFail };