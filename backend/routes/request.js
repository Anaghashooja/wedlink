const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { sendRequest, getReceivedRequests, updateRequestStatus,getPendingCount   } = require('../controllers/requestController');

// @route   POST /api/requests/send/:id
router.post('/send/:id', auth, sendRequest);

// @route   GET /api/requests/received
router.get('/received', auth, getReceivedRequests);

// @route   PUT /api/requests/:id/status
router.put('/:id/status', auth, updateRequestStatus);
router.put('/update/:id', auth, updateRequestStatus);
router.get('/count', auth, getPendingCount);

module.exports = router;