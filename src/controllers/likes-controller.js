const pool = require('../db');
const HttpError = require('../models/http-error');

const getLikesByMemberId = async (request, response, next) => {
  const memberId = request.params.uid;

  pool.query(
    'SELECT * FROM likes JOIN reviews ON likes.review = reviews.review_id WHERE likes.member=($1)',
    [memberId],
    (err, res) => {
      if (err) {
        const error = new HttpError(
          'Failed to fetch likes by the provided member id',
          500
        );
        return next(error);
      }
      response.status(200).json({ reviews: res.rows });
    }
  );
};

const getLikesByReviewId = async (request, response, next) => {
  const reviewId = request.params.rid;

  pool.query(
    'SELECT * FROM likes JOIN members ON likes.member = members.member_id WHERE likes.review=($1)',
    [reviewId],
    (err, res) => {
      if (err) {
        const error = new HttpError(
          'Failed to fetch likes by the provided review id',
          500
        );
        return next(error);
      }
      response.status(200).json({ members: res.rows });
    }
  );
};

const createLike = async (request, response, next) => {
  const memberId = request.params.uid;
  const { reviewId } = request.body;

  pool.query(
    'INSERT INTO likes(member, review) VALUES($1, $2)',
    [memberId, reviewId],
    (err, res) => {
      if (err) {
        const error = new HttpError('Failed to create new like', 500);
        return next(error);
      }

      response.status(201).end();
    }
  );
};

const deleteLikes = async (request, response, next) => {
  const reviewId = request.params.rid;
  const { memberId } = request.body;

  pool.query(
    'SELECT * FROM likes WHERE review=($1) AND member=($2)',
    [reviewId, memberId],
    (err, res) => {
      if (err) {
        const error = new HttpError('Failed to fetch like', 500);
        return next(error);
      }

      if (res.rows && res.rows.length === 0) {
        const error = new HttpError('Likes not found', 404);
        return next(error);
      }

      pool.query(
        'DELETE FROM likes WHERE review=($1) AND member=($2)',
        [reviewId, memberId],
        (err, res) => {
          if (err) {
            const error = new HttpError('Failed to delete the like', 500);
            return next(error);
          }

          response.status(204).end();
        }
      );
    }
  );
};

exports.getLikesByMemberId = getLikesByMemberId;
exports.getLikesByReviewId = getLikesByReviewId;
exports.createLike = createLike;
exports.deleteLikes = deleteLikes;
