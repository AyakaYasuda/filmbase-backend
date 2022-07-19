const { Router } = require('express');
const passport = require('passport');
require('../auth/passportConfig')(passport);

const moviesController = require('../controllers/movies-controller');
const router = Router();

router.get('/', moviesController.getAllMovies);

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  moviesController.getMovieById
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  moviesController.createMovie
);

module.exports = router;
