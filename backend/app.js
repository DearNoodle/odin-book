require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/authRoutes');
const appRouter = require('./routes/appRoutes');
const fetchRouter = require('./routes/fetchRoutes');
const profileRouter = require('./routes/profileRoutes');
const postRouter = require('./routes/postRoutes');
const commentRouter = require('./routes/commentRoutes');
const searchRouter = require('./routes/searchRoutes');
const messageRouter = require('./routes/messageRoutes');
const app = express();

const apiUrl = 'https://odin-photo-tagging-app.onrender.com/api';
module.exports = apiUrl;

app.use(
  cors({
    origin: 'https://dearnoodle-odin-book.netlify.app',
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

const routers = [
  authRouter,
  appRouter,
  fetchRouter,
  profileRouter,
  postRouter,
  commentRouter,
  searchRouter,
  messageRouter,
];

routers.forEach((router) => {
  app.use('/api', router);
});

const PORT = process.env.PORT || 10000;
// '0.0.0.0' host required for deploy
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Listening on port ${PORT}!`);
});
