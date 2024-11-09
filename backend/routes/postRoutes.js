const { Router } = require('express');
const controller = require('../controllers/postController');
const { jwtAuth } = require('./middlewares/routeAuth');

const router = Router();

router.post('/post', jwtAuth, controller.createPost);
router.get('/post/:id', jwtAuth, controller.readPost);
router.put('/post/:id', jwtAuth, controller.updatePost);
router.delete('/post/:id', jwtAuth, controller.deletePost);

router.get('/posts', jwtAuth, controller.readAllPosts);
router.get('/user/posts', jwtAuth, controller.readPostsByUserId);

module.exports = router;
