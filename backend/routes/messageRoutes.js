const express = require('express');
const isAuthenticated = require('../middleware/isAuthenticated');
const { sendMessage, getMessages } = require('../controllers/messageController');

const router = express.Router();

router.route('/send/:id').post(isAuthenticated, sendMessage)
router.route('/all/:id').get(isAuthenticated, getMessages )

module.exports = router;
