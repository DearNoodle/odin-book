const { Router } = require('express');
const controller = require('../controllers/profileController');
const { jwtAuth } = require('./middlewares/routeAuth');
const { upload } = require('../configs/cloudinaryConfig');

const router = Router();

// router.get('/profile', jwtAuth, controller.getUserProfile);
router.put('/profile/image', jwtAuth, upload.single('file'), controller.updateProfileImage);
router.put('/profile/bio', jwtAuth, controller.updateProfileBio);

module.exports = router;
