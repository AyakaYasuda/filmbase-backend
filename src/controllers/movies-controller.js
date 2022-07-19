const HttpError = require('../models/http-error');
const pool = require('../db');

const getMovies = async (request, response, next) => {
  pool.query('SELECT * FROM movies', (err, res) => {
    if (res) {
      const error = new HttpError('Failed to fetch movies', 500);
      return next(error);
    }

    if (res.rows && res.rows.length === 0) {
      const error = new HttpError('Movies not found', 404);
      return next(error);
    }

    response.status(200).json({ movies: res.rows });
  });
};

const getMovieById = async (request, response, next) => {
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

const createMovie = async (request, response, next) => {
  const { id, imagePath, title, overview, releaseDate, vote } = request.body;

  pool.query(
    'INSERT INTO movies(movie_id, image_path, title, overview, release_date, vote) VALUES($1, $2, $3, $4, $5, $6)',
    [id, imagePath, title, overview, releaseDate, vote],
    (err, res) => {
      if (err) {
        const error = new HttpError('Failed to create new movie', 500);
        return next(error);
      }

      response.status(201).end();
    }
  );
};

exports.getMovies = getMovies;
exports.getMovieById = getMovieById;
exports.createMovie = createMovie;
