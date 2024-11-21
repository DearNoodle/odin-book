require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/authRoutes');
const appRouter = require('./routes/appRoutes');
const fetchRouter = require('./routes/fetchRoutes');
const profileRouter = require('./routes/profileRoutes');
const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { configCloudinary } = require('./configs/cloudinaryConfig');
configCloudinary();

const passport = require('./configs/passportConfig');
app.use(passport.initialize());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const routers = [authRouter, appRouter, fetchRouter, profileRouter];

routers.forEach((router) => {
  app.use('/api', router);
});

const PORT = process.env.PORT || 8080;
// '0.0.0.0' host % 8080 POST required for railway deploy
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on port ${PORT}!`);
});
