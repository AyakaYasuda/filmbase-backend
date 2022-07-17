const pool = require('../db');
const HttpError = require('../models/http-error');

const getAllReviews = async (request, response, next) => {
  pool.query('SELECT * FROM reviews', (err, res) => {
    if (err) {
      const error = new HttpError('Failed to fetch all reviews');
      return next(error);
    }

    if (res.rows && res.rows.length === 0) {
      const error = new HttpError('Reviews not found', 404);
      return next(error);
    }

    response.status(200).json({ reviews: res.rows });
  });
};

const getReviewsByMemberId = async (request, response, next) => {
  const memberId = request.params.uid;

  if (!memberId) {
  }
  pool.query(
    'SELECT * FROM reviews WHERE reviewer_id=($1)',
    [memberId],
    (err, res) => {
      if (err) {
        const error = new HttpError(
          'Failed to fetch reviews by the provided reviewer id',
          500
        );
        return next(error);
      }

      if (res.rows && res.rows.length === 0) {
        const error = new HttpError('Reviews not found', 404);
        return next(error);
      }

      response.status(200).json({ reviews: res.rows });
    }
  );
};

const createReview = async (request, response, next) => {
  const memberId = request.params.uid;
  const { reviewer, movieId, rate, comment } = request.body;

  pool.query(
    'SELECT * FROM members WHERE member_id=($1)',
    [memberId],
    (err, res) => {
      if (err) {
        const error = new HttpError(
          'Failed to fetch a member by the provided member id',
          500
        );
        return next(error);
      }

      if (res.rows && res.rows.length === 0) {
        const error = new HttpError('Member not found', 404);
        return next(error);
      }

      pool.query(
        'INSERT INTO reviews(reviewer, reviewer_id, movie_id, rate, comment) VALUES($1, $2, $3, $4, $5)',
        [reviewer, memberId, movieId, rate, comment],
        (err, res) => {
          if (err) {
            const error = new HttpError('Failed to create new review', 500);
            return next(error);
          }

          response
            .status(201)
            .json({ message: 'Successfully created new review' });
        }
      );
    }
  );
};

exports.getAllReviews = getAllReviews;
exports.getReviewsByMemberId = getReviewsByMemberId;
exports.createReview = createReview;
