const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const isAuthenticated = require('../middleware/isAuthenticated');
const upload = require('../middleware/multer');

router.route('/register').post(userController.register);
router.route('/login').post(userController.login)
router.route('/logout').get(userController.logout);
router.route('/:id/profile').get(isAuthenticated, userController.getProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePicture') ,userController.editProfile);
router.route('/suggested').get(isAuthenticated, userController.getSuggestedUsers);
router.route('/followOrUnfollow/:id').post(isAuthenticated, userController.followOrUnfollow);


module.exports = router;