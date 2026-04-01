const express = require('express');
const router = express.Router();
const { getStories, submitStory } = require('../controllers/storyController');
const auth = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getStories);
router.post('/submit', auth, upload.array('photos', 1), submitStory);

module.exports = router;