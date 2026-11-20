// Thin: read the validated input, call one service function, pick the status.
const { matchedData } = require('express-validator');
const userService = require('../services/user.service');
const { toUserJson } = require('../utils/user-json');

async function list(req, res) {
  const users = await userService.list();
  res.status(200).json(users.map(toUserJson));
}

async function changeRole(req, res) {
  const { id, role } = matchedData(req);
  const user = await userService.changeRole(id, role, req.user);
  res.status(200).json({ user: toUserJson(user) });
}

module.exports = { list, changeRole };