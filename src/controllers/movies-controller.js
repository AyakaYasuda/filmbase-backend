const HttpError = require('../models/http-error');
const pool = require('../db');

const getMovieById = (request, response, next) => {
  const movieId = request.params.id;

  pool.query(
    'SELECT * FROM movies WHERE movie_id=($1)',
    [movieId],
    (err, res) => {
      if (err) {
        const error = new HttpError(
          'Failed to fetch a movie by the provided id'
        );
        return next(error);
      }

      if (res.rows && res.rows.length === 0) {
        const error = new HttpError('Movie not found', 404);
        return next(error);
      }

      response.status(200).json({
        movie: res.rows[0],
      });
    }
  );
};

exports.getMovieById = getMovieById;
