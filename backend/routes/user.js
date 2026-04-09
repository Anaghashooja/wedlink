const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { updatePassword, updateNotifications, deleteAccount, blockUser, getBlockedUsers, unblockUser } = require('../controllers/userController');

router.put('/settings/password', auth, updatePassword);
router.put('/settings/notifications', auth, updateNotifications);
router.delete('/settings/account', auth, deleteAccount);
router.post('/block/:id', auth, blockUser);
router.get('/blocked-list', auth, getBlockedUsers);
router.delete('/unblock/:id', auth, unblockUser);

module.exports = router;