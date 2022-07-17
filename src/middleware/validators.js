const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

const authValidator = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError('Invalid request', 422);
    return next(error);
  }

  return next();
};

exports.authValidator = authValidator;
