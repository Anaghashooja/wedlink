const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const powerBiAuth = require('../middleware/powerBiAuth');
const User = require('../models/User');
const Story = require('../models/Story');
const { getPowerBIData } = require('../controllers/analyticsController');
// 1. Get Dashboard Stats
router.get('/stats', auth, admin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const pendingVerify = await User.countDocuments({ verificationStatus: 'pending' });
        const pendingStories = await Story.countDocuments({ isVerified: false });
        res.json({ totalUsers, pendingVerify, pendingStories });
    } catch (err) { res.status(500).send("Server Error"); }
});

// 2. Get Pending Stories for approval
router.get('/stories/pending', auth, admin, async (req, res) => {
    const stories = await Story.find({ isVerified: false });
    res.json(stories);
});

// 3. Approve a Story
router.put('/stories/approve/:id', auth, admin, async (req, res) => {
    await Story.findByIdAndUpdate(req.params.id, { isVerified: true });
    res.json({ msg: "Story approved!" });
});
// This route provides the raw data for Power BI
router.get('/data-for-bi', powerBiAuth, async (req, res) => {
    const data = await User.find().select('gender religion profession annualIncome membership createdAt');
    res.json(data);
});
router.get('/bi-data', powerBiAuth, getPowerBIData);
module.exports = router; 