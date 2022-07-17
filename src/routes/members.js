const { Router } = require('express');
const { check } = require('express-validator');
const passport = require('passport');
require('../auth/passportConfig')(passport);

const membersController = require('../controllers/members-controller');

const router = Router();

router.post(
  '/signup',
  [
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  passport.authenticate('local-signup', { session: false }),
  membersController.signup
);

router.post(
  '/login',
  [
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  passport.authenticate('local-login', { session: false }),
  membersController.login
);

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  membersController.getAllMembers
);

module.exports = router;
