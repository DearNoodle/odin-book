const { Router } = require('express');
const controller = require('../controllers/messageController');
const { jwtAuth } = require('./middlewares/routeAuth');

const router = Router();

router.post('/message/user/:id', jwtAuth, controller.createMessage);

module.exports = router;
