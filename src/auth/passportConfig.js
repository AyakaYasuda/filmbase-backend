require('dotenv').config();

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const bcrypt = require('bcrypt');

const pool = require('../db');

module.exports = (passport) => {
  passport.use(
    'local-login',
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        pool.query(
          'SELECT * FROM members WHERE email=($1)',
          [email],
          (err, res) => {
            if (err) return done(null, false);

            if (res.rows.length === 0) return done(null, false);

            const isMatching = bcrypt.compareSync(
              password,
              res.rows[0].password
            );

            if (!isMatching) return done(null, false);

            return done(null, res.rows[0]);
          }
        );
      }
    )
  );

  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (jwtPayload, done) => {
        try {
          const user = jwtPayload.user;
          done(null, user);
        } catch (error) {
          done(null, false);
        }
      }
    )
  );
};
