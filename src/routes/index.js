const { Router } = require('express');

const members = require('./members');
const movies = require('./movies');
const reviews = require('./reviews');
const likes = require('./likes');

const router = Router();

router.get('/', (req, res) => {
  res.redirect('/members/login');
});

router.use('/members', members);
router.use('/movies', movies);
router.use('/reviews', reviews);
router.use('/likes', likes);

module.exports = router;
