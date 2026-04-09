const User = require('../models/User');
const bcrypt = require('bcryptjs');

// 1. Update Password
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Current password incorrect" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ msg: "Password updated successfully" });
    } catch (err) { res.status(500).send("Server Error"); }
};

// 2. Update Notification Toggles
exports.updateNotifications = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { notificationSettings: req.body },
            { new: true }
        );
        res.json(user.notificationSettings);
    } catch (err) { res.status(500).send("Error updating notifications"); }
};

// 3. Delete Account
exports.deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.json({ msg: "Account deleted permanently" });
    } catch (err) { res.status(500).send("Error deleting account"); }
};
// 4. Block a User
exports.blockUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $addToSet: { blockedUsers: req.params.id } // $addToSet prevents duplicates
        });
        res.json({ msg: "User blocked successfully" });
    } catch (err) { res.status(500).send("Error blocking user"); }
};

// 5. Get list of Blocked Users
exports.getBlockedUsers = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('blockedUsers', 'name photos');
        res.json(user.blockedUsers);
    } catch (err) { res.status(500).send("Error fetching blocked list"); }
};

// 6. Unblock a User
exports.unblockUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { blockedUsers: req.params.id }
        });
        res.json({ msg: "User unblocked" });
    } catch (err) { res.status(500).send("Error unblocking user"); }
};