const express = require('express');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const app = express();

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

// Define JWT strategy
const jwtStrategy = new JwtStrategy(jwtOptions, (payload, done) => {
  const user = { id: payload.sub, username: payload.username };
  if (user) {
    return done(null, user);
  } else {
    return done(null, false);
  }
});

passport.use(jwtStrategy);

app.use(passport.initialize());

// Define your authentication middleware
const auth = () => async (req, res, next) => {
  try {
    await new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err) {
          return reject(err);
        }
        if (!user) {
          return reject(new Error('Unauthorized'));
        }
        req.user = user; // Make the user available in request object
        resolve(user);
      })(req, res, next);
    });
    next();
  } catch (err) {
    next(err);
  }
};

 module.exports = auth
