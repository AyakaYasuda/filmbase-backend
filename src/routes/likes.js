const { Router } = require('express');
const passport = require('passport');
require('../auth/passportConfig')(passport);

const likesController = require('../controllers/likes-controller');
const router = Router();

router.get(
  '/member/:uid',
  passport.authenticate('jwt', { session: false }),
  likesController.getLikesByMemberId
);

router.get(
  '/:rid',
  passport.authenticate('jwt', { session: false }),
  likesController.getLikesByReviewId
);

router.post(
  '/member/:uid',
  passport.authenticate('jwt', { session: false }),
  likesController.createLike
);

router.delete(
  '/member/:uid/:rid',
  passport.authenticate('jwt', { session: false }),
  likesController.deleteLikes
);

module.exports = router;
