const { Router } = require('express');
const controller = require('../controllers/appController');
const { jwtAuth } = require('./middlewares/routeAuth');

const router = Router();

router.get('/user/:id', jwtAuth, controller.getUserInfo);

router.get('/search/posts', jwtAuth, controller.getSearchPosts);

router.put('/follow/user/:id', jwtAuth, controller.updateFollow);

// router.get('/search/users', jwtAuth, controller.getSearchUsers);

module.exports = router;
