const { Router } = require('express');
const { check } = require('express-validator');
const passport = require('passport');
require('../auth/passportConfig')(passport);

const membersController = require('../controllers/members-controller');
const validators = require('../middleware/validators');
const router = Router();

router.post(
  '/signup',
  [
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  validators.authValidator,
  passport.authenticate('local-signup', { session: false }),
  membersController.signup
);

router.post(
  '/login',
  [
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  validators.authValidator,
  passport.authenticate('local-login', { session: false }),
  membersController.login
);

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  membersController.getAllMembers
);

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  membersController.getMemberById
);

module.exports = router;
