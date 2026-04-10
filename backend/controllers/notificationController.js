const Notification = require('../models/Notification');

// 1. Fetch all notifications for the user
exports.getNotifications = async (req, res) => {
    try {
        const alerts = await Notification.find({ receiver: req.user.id })
            .populate('sender', 'name photos')
            .sort({ createdAt: -1 });
        res.json(alerts);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

// 2. Mark all as read
exports.markRead = async (req, res) => {
    try {
        await Notification.updateMany({ receiver: req.user.id }, { isRead: true });
        res.json({ msg: "All marked as read" });
    } catch (err) {
        res.status(500).send("Error updating alerts");
    }
};