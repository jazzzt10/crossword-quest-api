// What a well-formed request looks like. Rules come from the data dictionary.
const { body, param } = require('express-validator');

const name = () => body('name')
  .exists().withMessage('name is required')
  .bail()
  .isString().withMessage('name must be text')
  .bail()
  .trim()
  .isLength({ min: 3, max: 100 }).withMessage('name must be 3 to 100 characters long');

const idParam = [
  param('id')
    .isInt({ min: 1, max: 2147483647 }).withMessage('id must be a positive whole number')
    .toInt(),
];

const createRules = [name()];
const updateRules = [...idParam, name()];

module.exports = { idParam, createRules, updateRules };