const express = require('express');
const isAuthenticated = require('../middleware/isAuthenticated');
const { addNewPost, getAllPosts, getUserPost, likePost, addComment, getCommentsofPost, deletePost, bookmarkPost } = require('../controllers/postController');
const upload = require('../middleware/multer');

const router = express.Router()

router.route('/addPost').post(isAuthenticated, upload.single('image') ,addNewPost)
router.route('/all').get(isAuthenticated , getAllPosts)
router.route('/userPost/all').get(isAuthenticated , getUserPost)
router.route('/:id/likes').post(isAuthenticated , likePost)
router.route('/:id/comment').post(isAuthenticated , addComment)
router.route('/:id/comment/all').get(isAuthenticated , getCommentsofPost)
router.route('/delete/:id').get(isAuthenticated , deletePost)
router.route('/:id/bookmark').get(isAuthenticated , bookmarkPost)

module.exports = router;

