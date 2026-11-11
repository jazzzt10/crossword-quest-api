// One line, one row of the API endpoint table.
const { Router } = require('express');
const requireUser = require('../middlewares/require-user');
const validate = require('../middlewares/validate');
const rules = require('../validators/session.validator');
const controller = require('../controllers/session.controller');

const router = Router();

router.post('/', requireUser('HOST', 'ADMIN'), rules.createRules, validate, controller.create);
router.get('/:code', rules.codeParam, validate, controller.get);
router.patch('/:code', requireUser('HOST', 'ADMIN'), rules.statusRules, validate, controller.changeStatus);

module.exports = router;