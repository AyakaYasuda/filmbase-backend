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
    check('username').isLength({ min: 1 }),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  validators.authValidator,
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

router.post(
  '/:id/favorite',
  passport.authenticate('jwt', { session: false }),
  membersController.getFavoriteMovies
);

router.put(
  '/movie/add/:id',
  passport.authenticate('jwt', { session: false }),
  membersController.addFavoriteMovie
);

router.put(
  '/movie/remove/:id',
  passport.authenticate('jwt', { session: false }),
  membersController.removeFavoriteMovie
);

module.exports = router;
