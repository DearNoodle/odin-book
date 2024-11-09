const passport = require('../../configs/passportConfig');

function localAuth(req, res, next) {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error(info.message || 'Unauthorized'));
    }
    req.user = user;
    next();
  })(req, res, next);
}

function jwtAuth(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error(info.message || 'Unauthorized'));
    }
    req.user = user;
    next();
  })(req, res, next);
}

function githubAuth(req, res, next) {
  passport.authenticate('github', { scope: ['user:email'], session: false })(req, res, next);
}

function githubCBAuth(req, res, next) {
  passport.authenticate('github', { failureRedirect: '/login', session: false })(req, res, next);
}

module.exports = { localAuth, jwtAuth, githubAuth, githubCBAuth };
