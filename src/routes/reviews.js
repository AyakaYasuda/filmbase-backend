const { Router } = require('express');
const passport = require('passport');
require('../auth/passportConfig')(passport);

const reviewsController = require('../controllers/reviews-controller');
const router = Router();

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  reviewsController.getAllReviews
);
router.get(
  '/member/:uid',
  passport.authenticate('jwt', { session: false }),
  reviewsController.getReviewsByMemberId
);
router.post(
  '/member/:uid',
  passport.authenticate('jwt', { session: false }),
  reviewsController.createReview
);

module.exports = router;
