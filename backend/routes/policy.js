const express = require('express');
const router = express.Router();
const { getPrivacyPolicy } = require('../controllers/policyController');

router.get('/', getPrivacyPolicy);

module.exports = router;