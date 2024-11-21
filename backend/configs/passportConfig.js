const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { PrismaClient } = require('@prisma/client');
const query = require('../models/query');

const prisma = new PrismaClient();

const localStrategyOptions = {
  usernameField: 'username',
  passportField: 'password',
};

const jwtStrategyOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    ExtractJwt.fromBodyField('token'),
    ExtractJwt.fromUrlQueryParameter('token'),
    ExtractJwt.fromHeader('Authorization'),
    ExtractJwt.fromExtractors([
      (req) => {
        var token = null;
        if (req && req.cookies) {
          token = req.cookies['accessToken'];
        }
        return token;
      },
    ]),
  ]),
  secretOrKey: process.env.JWT_SECRET || 'your_secret_key',
};

const githubStrategyOptions = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:8080/api/login/github/callback',
};

const verifyLocal = async (username, password, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return done(null, false, { message: 'Incorrect username' });
    }
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return done(null, false, { message: 'Incorrect password' });
    }

    if (!password) {
      return done(null, false, { message: 'No password provided' });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

const verifyJwt = async (payload, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

const verifyGithub = async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await prisma.user.findUnique({ where: { githubId: profile.id } });

    if (!user) {
      user = await query.createGHUser(profile);
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

passport.use(new LocalStrategy(localStrategyOptions, verifyLocal));
passport.use(new JwtStrategy(jwtStrategyOptions, verifyJwt));
passport.use(new GitHubStrategy(githubStrategyOptions, verifyGithub));

module.exports = passport;
