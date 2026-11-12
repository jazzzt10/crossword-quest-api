// One line, one row of the API endpoint table.
const { Router } = require('express');
const requireUser = require('../middlewares/require-user');
const validate = require('../middlewares/validate');
const rules = require('../validators/session.validator');
const sessionController = require('../controllers/session.controller');
const playerController = require('../controllers/player.controller');

const router = Router();

router.post('/', requireUser('HOST', 'ADMIN'), rules.createRules, validate, sessionController.create);
router.get('/:code', rules.codeParam, validate, sessionController.get);
router.patch('/:code', requireUser('HOST', 'ADMIN'), rules.statusRules, validate, sessionController.changeStatus);

// Players are a part of a session, so their URLs sit under it.
router.post('/:code/players', requireUser(), rules.joinRules, validate, playerController.join);
router.get('/:code/players', rules.codeParam, validate, playerController.list);

module.exports = router;