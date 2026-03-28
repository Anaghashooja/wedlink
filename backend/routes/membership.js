const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upgradeMembership } = require('../controllers/membershipController');

router.post('/upgrade', auth, upgradeMembership);

module.exports = router;