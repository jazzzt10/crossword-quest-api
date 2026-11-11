// What a well-formed request looks like. Rules come from the data dictionary.
const { body, param } = require('express-validator');

// Six digits, and it does not start with 0.
const codeParam = param('code')
  .matches(/^[1-9][0-9]{5}$/).withMessage('the join code must be six digits');

const createRules = [
  body('set_id')
    .exists().withMessage('set_id is required')
    .bail()
    .isInt({ min: 1, max: 2147483647 }).withMessage('set_id must be a positive whole number')
    .toInt(),
];

// A client may only ask for these two. The service decides if the change is allowed.
const statusRules = [
  codeParam,
  body('status').isIn(['PLAYING', 'FINISHED']).withMessage('status must be PLAYING or FINISHED'),
];

const joinRules = [
  codeParam,
  body('nickname')
    .exists().withMessage('nickname is required')
    .bail()
    .isString().withMessage('nickname must be text')
    .bail()
    .trim()
    .isLength({ min: 2, max: 30 }).withMessage('nickname must be 2 to 30 characters long'),
];

module.exports = { codeParam, createRules, statusRules, joinRules };