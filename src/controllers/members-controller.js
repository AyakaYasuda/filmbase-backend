require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const pool = require('../db');
const HttpError = require('../models/http-error');

const signup = async (request, response, next) => {
  const { username, email, password } = request.body;

  pool.query('SELECT * FROM members WHERE email=($1)', [email], (err, res) => {
    if (err) {
      const error = new HttpError('Failed to fetch user', 500);
      return next(error);
    }

    if (res.rows.length !== 0) {
      const error = new HttpError('User already exists', 409);
      return next(error);
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    pool.query(
      'INSERT INTO members (name, email, password, favorite_movies) VALUES($1, $2, $3, $4)',
      [username, email, passwordHash, {}],
      (err, res) => {
        if (err) {
          const error = new HttpError('Failed to create new user', 500);
          return next(error);
        }

        response.status(200).json({ message: 'Log in successfully', username });
      }
    );
  });
};

const login = async (request, response, next) => {
  jwt.sign(
    { user: request.user },
    process.env.JWT_SECRET,
    { expiresIn: '1hr' },
    (err, token) => {
      if (err) {
        const error = new HttpError('Failed to login', 500);
        return next(error);
      }

      response.status(200).json({
        message: 'Log in successfully',
        token: token,
        userId: request.user.member_id,
      });
    }
  );
};

const getAllMembers = async (request, response, next) => {
  pool.query('SELECT * FROM members', (err, res) => {
    if (err) {
      const error = new HttpError('Failed to fetch all members', 500);
      return next(error);
    }

    response.status(200).json({
      members: res.rows,
    });
  });
};

const getMemberById = async (request, response, next) => {
  const memberId = request.params.id;

  pool.query(
    'SELECT * FROM members WHERE member_id=($1)',
    [memberId],
    (err, res) => {
      if (err) {
        const error = new HttpError(
          'Failed to fetch a member by the provided id',
          500
        );
        return next(error);
      }

      if (res.rows && res.rows.length === 0) {
        const error = new HttpError('Member not found', 404);
        return next(error);
      }

      response.status(200).json({ member: res.rows[0] });
    }
  );
};

const getFavoriteMovies = async (request, response, next) => {
  const { favoriteMoviesId } = request.body;

  pool.query(
    `SELECT * FROM movies WHERE movie_id IN (${favoriteMoviesId?.join()})`,
    (err, res) => {
      if (err) {
        const error = new HttpError('Failed to fetch movies', 500);
        return next(error);
      }

      if (res.rows && res.rows.length === 0) {
        const error = new HttpError('Movies not found', 404);
        return next(error);
      }

      response.status(200).json({ movies: res.rows });
    }
  );
};

const addFavoriteMovie = async (request, response, next) => {
  const memberId = request.params.id;
  const { movieId } = request.body;

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

      const existingFavoriteMoviesArray = res.rows[0].favorite_movies;

      const updatedFavoriteMoviesArray = [
        ...existingFavoriteMoviesArray,
        movieId,
      ];

      const intArray = `{${updatedFavoriteMoviesArray.join()}}`;

      pool.query(
        `UPDATE members SET favorite_movies='${intArray}' WHERE member_id=${memberId}`,
        (err, res) => {
          if (err) {
            const error = new HttpError('Failed to update the member', 500);
            return next(error);
          }

          response.status(204).end();
        }
      );
    }
  );
};

const removeFavoriteMovie = async (request, response, next) => {
  const memberId = request.params.id;
  const { movieId } = request.body;

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

      const existingFavoriteMoviesArray = res.rows[0].favorite_movies;

      const updatedFavoriteMoviesArray = existingFavoriteMoviesArray.filter(
        (item) => item !== movieId
      );

      const intArray = `{${updatedFavoriteMoviesArray.join()}}`;

      pool.query(
        `UPDATE members SET favorite_movies='${intArray}' WHERE member_id=${memberId}`,
        (err, res) => {
          if (err) {
            const error = new HttpError('Failed to update the member', 500);
            return next(error);
          }

          response.status(204).end();
        }
      );
    }
  );
};

exports.signup = signup;
exports.login = login;
exports.getAllMembers = getAllMembers;
exports.getMemberById = getMemberById;
exports.getFavoriteMovies = getFavoriteMovies;
exports.addFavoriteMovie = addFavoriteMovie;
exports.removeFavoriteMovie = removeFavoriteMovie;
