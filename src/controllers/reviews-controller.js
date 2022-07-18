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

          response.status(201).end();
        }
      );
    }
  );
};

const editReview = async (request, response, next) => {
  const reviewId = request.params.rid;
  const reqBody = request.body;

  pool.query(
    'SELECT * FROM reviews WHERE review_id=($1)',
    [reviewId],
    (err, res) => {
      if (err) {
        const error = new Error(
          'Failed to fetch review by the provided review id',
          500
        );
        return next(error);
      }

      if (res.rows && res.rows.length === 0) {
        const error = new Error('Review not found', 404);
        return next(error);
      }

      const keys = ['rate', 'comment'];
      let fields = [];

      keys.forEach((key) => {
        if (reqBody[key]) fields.push(key);
      });

      fields.forEach((field, idx) => {
        pool.query(
          `UPDATE reviews SET ${field}=($1) WHERE review_id=($2)`,
          [reqBody[field], reviewId],
          (err, res) => {
            if (err) {
              const error = new HttpError('Failed to update the review', 500);
              return next(error);
            }

            if (idx === fields.length - 1) {
              response.status(204).end();
            }
          }
        );
      });
    }
  );
};

const deleteReview = async (request, response, next) => {
  const reviewId = request.params.rid;

  pool.query(
    'SELECT * FROM likes WHERE review=($1)',
    [reviewId],
    (err, res) => {
      if (err) {
        const error = new HttpError('Failed to fetch liked', 500);
        return next(error);
      }

      if (res.rows && res.rows.length !== 0) {
        pool.query(
          'DELETE FROM likes WHERE review=($1)',
          [reviewId],
          (err, res) => {
            if (err) {
              const error = new HttpError('Failed to delete likes', 500);
              return next(error);
            }

            return;
          }
        );
      }
    }
  );

  pool.query('DELETE FROM likes WHERE review=($1)', [reviewId], (err, res) => {
    if (err) {
      const error = new HttpError('Failed to delete likes', 500);
      return next(error);
    }

    pool.query(
      'SELECT * FROM reviews WHERE review_id=($1)',
      [reviewId],
      (err, res) => {
        if (err) {
          const error = new Error(
            'Failed to fetch review by the provided review id',
            500
          );
          return next(error);
        }

        if (res.rows && res.rows.length === 0) {
          const error = new Error('Review not found', 404);
          return next(error);
        }

        pool.query(
          'DELETE FROM reviews WHERE review_id=($1)',
          [reviewId],
          (err, res) => {
            if (err) {
              const error = new HttpError('Failed to delete the review', 500);
              return next(error);
            }

            response.status(204).end();
          }
        );
      }
    );
  });
};

exports.getAllReviews = getAllReviews;
exports.getReviewsByMemberId = getReviewsByMemberId;
exports.createReview = createReview;
exports.editReview = editReview;
exports.deleteReview = deleteReview;
