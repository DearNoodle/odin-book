const { Router } = require('express');
const controller = require('../controllers/appController');
const { jwtAuth } = require('./middlewares/routeAuth');

const router = Router();

// router.get('/follows', jwtAuth, controller.getFollowedUsers);
// router.get('/posts/recent', jwtAuth, controller.getRecentPosts);
// router.get('/user/:id/posts', jwtAuth, controller.getUserPosts);

router.get('/search/users', jwtAuth, controller.getSearchUsers);
router.get('/search/posts', jwtAuth, controller.getSearchPosts);

router.get('/user/:id', jwtAuth, controller.getUserInfo);
// router.get('/user/:id/name', jwtAuth, controller.getUsername);

module.exports = router;
