const { Router } = require('express');
const controller = require('../controllers/appController');
const { jwtAuth } = require('./middlewares/routeAuth');

const router = Router();

router.get('/chats/recent', jwtAuth, controller.getRecentChatters);
router.get('/posts/recent', jwtAuth, controller.getRecentPosts);
router.get('/search/users', jwtAuth, controller.getSearchUsers);
router.get('/search/posts', jwtAuth, controller.getSearchPosts);

router.get('/user/:id', jwtAuth, controller.getUsername);

module.exports = router;
