const { Router } = require('express');
const controller = require('../controllers/commentController');
const { jwtAuth } = require('./middlewares/routeAuth');

const router = Router();

router.post('/comment', jwtAuth, controller.createComment);
router.get('/comment/:id', jwtAuth, controller.readComment);
router.put('/comment/:id', jwtAuth, controller.updateComment);
router.delete('/comment/:id', jwtAuth, controller.deleteComment);

router.get('/post/:id/comments', jwtAuth, controller.readAllPostComments);
module.exports = router;
