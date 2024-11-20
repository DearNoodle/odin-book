const { Router } = require('express');
const controller = require('../controllers/postController');
const { jwtAuth } = require('./middlewares/routeAuth');

const router = Router();

router.post('/post', jwtAuth, controller.createPost);
router.delete('/post/:id', jwtAuth, controller.deletePost);

module.exports = router;
