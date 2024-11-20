const { Router } = require('express');
const controller = require('../controllers/authController');
const { jwtAuth } = require('./middlewares/routeAuth');

const router = Router();

// router.get('/message', jwtAuth, controller.getChatMessages);
router.post('/message', jwtAuth, controller.createMessage);

module.exports = router;
