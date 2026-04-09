const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upgradeMembership, confirmPayment, getSubscriptionInfo, logPaymentFailure } = require('../controllers/membershipController');

router.post('/upgrade', auth, upgradeMembership);
router.post('/confirm', auth, confirmPayment);
router.get('/status', auth, getSubscriptionInfo);
router.post('/log-failure', auth, logPaymentFailure);
module.exports = router;