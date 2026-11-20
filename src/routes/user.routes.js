// Account management: every route here is for admins only.
const { Router } = require('express');
const requireUser = require('../middlewares/require-user');
const validate = require('../middlewares/validate');
const rules = require('../validators/auth.validator');
const controller = require('../controllers/user.controller');

const router = Router();

// The guard comes first, so a stranger learns nothing about our rules.
router.use(requireUser('ADMIN'));

router.get('/', controller.list);
router.patch('/:id/role', rules.roleRules, validate, controller.changeRole);

module.exports = router;