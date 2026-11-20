// What a well-formed request looks like. Rules come from the data dictionary.
const { body, param } = require('express-validator');

const schoolId = () => body('school_id')
  .exists().withMessage('school_id is required').bail()
  .isString().withMessage('school_id must be text').bail()
  .trim()
  .matches(/^[0-9]{4}-[0-9]{4,6}$/).withMessage('school_id must look like 2099-0001');

const fullName = () => body('full_name')
  .exists().withMessage('full_name is required').bail()
  .isString().withMessage('full_name must be text').bail()
  .trim()
  .isLength({ min: 2, max: 100 }).withMessage('full_name must be 2 to 100 characters long');

const email = () => body('email')
  .exists().withMessage('email is required').bail()
  .isString().withMessage('email must be text').bail()
  .trim()
  .isLength({ max: 255 }).withMessage('email must be at most 255 characters long').bail()
  .isEmail().withMessage('email must be a valid email address');

// bcrypt reads only 72 bytes, so a longer password is refused instead of silently cut.
const newPassword = () => body('password')
  .exists().withMessage('password is required').bail()
  .isString().withMessage('password must be text').bail()
  .isLength({ min: 8, max: 72 }).withMessage('password must be 8 to 72 characters long').bail()
  .matches(/[A-Za-z]/).withMessage('password needs at least one letter').bail()
  .matches(/[0-9]/).withMessage('password needs at least one number');

// No rule for "role" here. matchedData drops fields that have no rule,
// so a "role" sent in the body never reaches the service.
const registerRules = [schoolId(), fullName(), email(), newPassword()];

// Login only checks that both are text. It never says which one is wrong.
const loginRules = [
  body('school_id').exists().withMessage('school_id is required').bail()
    .isString().withMessage('school_id must be text'),
  body('password').exists().withMessage('password is required').bail()
    .isString().withMessage('password must be text'),
];

const idParam = param('id')
  .isInt({ min: 1, max: 2147483647 }).withMessage('id must be a positive whole number')
  .toInt();

const roleRules = [
  idParam,
  body('role').exists().withMessage('role is required').bail()
    .isIn(['PLAYER', 'HOST', 'ADMIN']).withMessage('role must be PLAYER, HOST or ADMIN'),
];

module.exports = { registerRules, loginRules, roleRules };