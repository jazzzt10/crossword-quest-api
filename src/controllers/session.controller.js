// Thin: read the validated input, call one service function, pick the status.
const { matchedData } = require('express-validator');
const gameInfo = require('../config/game-info');
const sessionService = require('../services/session.service');

// Only these fields leave the API. No row ids of the session.
function toJson(session, playerCount) {
  const json = {
    code: session.join_code,
    status: session.status,
    set_id: Number(session.set_id),
    host_id: Number(session.host_id),
    shareable_link: session.shareable_link,
    started_at: session.started_at,
    ended_at: session.ended_at,
    created_at: session.created_at,
  };
  if (playerCount !== undefined) {
    json.player_count = playerCount;
    json.max_players = gameInfo.max_players;
  }
  return json;
}

async function create(req, res) {
  const { set_id: setId } = matchedData(req, { locations: ['body'] });
  const session = await sessionService.create(setId, req.user);
  res.status(201).json(toJson(session));
}

async function get(req, res) {
  const { code } = matchedData(req, { locations: ['params'] });
  const { session, playerCount } = await sessionService.get(code);
  res.status(200).json(toJson(session, playerCount));
}

async function changeStatus(req, res) {
  const { code, status } = matchedData(req, { locations: ['params', 'body'] });
  const session = await sessionService.changeStatus(code, status, req.user);
  res.status(200).json(toJson(session));
}

module.exports = { create, get, changeStatus };