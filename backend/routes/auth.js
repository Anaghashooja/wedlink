const express = require("express");
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { register, googleAuth, login, getMatches, getProfile,getPublicProfile,searchUsers,submitVerification,togglePrivacy } = require('../controllers/authController');
const { reportUser } = require('../controllers/reportController');
const auth = require('../middleware/auth');
// @route   POST /api/auth/register
// @desc    Register user and upload photos
router.post('/register', upload.array('photos', 6), register);

router.post('/google', googleAuth);

// LOGIN ROUTE
router.post("/login", login);

router.get('/matches', getMatches);

router.get('/me', auth, getProfile);
router.get("/user/:id", auth, getPublicProfile);
router.post('/report/:id', auth, reportUser); 
router.get('/search', auth, searchUsers); 
router.put('/privacy', auth, togglePrivacy); 
router.post('/verify', auth, upload.array('photos', 1), submitVerification); 
module.exports = router;