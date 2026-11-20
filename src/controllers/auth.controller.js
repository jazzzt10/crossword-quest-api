// Thin: read the validated input, call one service function, pick the status.
const { matchedData } = require('express-validator');
const authService = require('../services/auth.service');
const { toUserJson } = require('../utils/user-json');

async function register(req, res) {
  const data = matchedData(req, { locations: ['body'] });
  const user = await authService.register(data);
  res.status(201).json({ user: toUserJson(user) });
}

async function login(req, res) {
  const { school_id: schoolId, password } = matchedData(req, { locations: ['body'] });
  const { user, token, expiresIn } = await authService.login(schoolId, password);
  res.status(200).json({ token, token_type: 'Bearer', expires_in: expiresIn, user: toUserJson(user) });
}

// currentUser already read the account for this token.
async function me(req, res) {
  res.status(200).json({ user: toUserJson(req.account) });
}

module.exports = { register, login, me };