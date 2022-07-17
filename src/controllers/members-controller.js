require('dotenv').config();

const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const HttpError = require('../models/http-error');

const signup = async (request, response, next) => {
  const errors = validationResult({
    name: request.user.name,
    email: request.user.email,
    password: request.user.password,
  });

  if (!errors.isEmpty()) {
    const error = new HttpError('Invalid request. Please check your data', 422);
    return next(error);
  }

  jwt.sign(
    { user: request.user },
    process.env.JWT_SECRET,
    { expiresIn: '1hr' },
    (err, token) => {
      if (err) {
        const error = new HttpError('Failed to sign up', 500);
        return next(error);
      }

      response.json({
        message: 'Sign up successfully',
        token: token,
      });
    }
  );
};

const login = async (request, response, next) => {
  const errors = validationResult({
    email: request.user.email,
    password: request.user.password,
  });

  if (!errors.isEmpty()) {
    const error = new HttpError('Invalid request. Please check your data', 422);
    return next(error);
  }

  jwt.sign(
    { user: request.user },
    process.env.JWT_SECRET,
    { expiresIn: '1hr' },
    (err, token) => {
      if (err) {
        const error = new HttpError('Failed to login', 500);
        return next(error);
      }

      response.json({ message: 'Log in successfully', token: token });
    }
  );
};

const getAllMembers = async (request, response, next) => {
  pool.query('SELECT * FROM members', (err, res) => {
    if (err) {
      const error = new HttpError('Failed to fetch all members', 500);
      return next(error);
    }

    response.json({
      message: 'Successfully fetched all members',
      members: res.rows
    });
  });
};

exports.signup = signup;
exports.login = login;
exports.getAllMembers = getAllMembers;
