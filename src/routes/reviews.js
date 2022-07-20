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
  '/:rid',
  passport.authenticate('jwt', { session: false }),
  reviewsController.getReviewById
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
router.put(
  '/:rid',
  passport.authenticate('jwt', { session: false }),
  reviewsController.editReview
);
router.delete(
  '/:rid',
  passport.authenticate('jwt', { session: false }),
  reviewsController.deleteReview
);

module.exports = router;
