const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getConversations, getChatHistory } = require('../controllers/messageController');

router.get('/conversations', auth, getConversations);
router.get('/history/:otherId', auth, getChatHistory); 

module.exports = router;