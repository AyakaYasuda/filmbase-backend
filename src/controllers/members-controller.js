require('dotenv').config();
const jwt = require('jsonwebtoken');

const pool = require('../db');
const HttpError = require('../models/http-error');

const signup = async (request, response, next) => {
  response.status(201).json({
    message: 'Sign up successfully',
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

      response
        .status(200)
        .json({ message: 'Log in successfully', token: token });
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
      message: 'Successfully fetched all members',
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

exports.signup = signup;
exports.login = login;
exports.getAllMembers = getAllMembers;
exports.getMemberById = getMemberById;
