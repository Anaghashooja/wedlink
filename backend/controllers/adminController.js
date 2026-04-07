const User = require('../models/User');
const Story = require('../models/Story');
const Report = require('../models/Report');
const Message = require('../models/Message');

// 1. GET DASHBOARD STATS
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const pendingVerifications = await User.countDocuments({ verificationStatus: 'pending' });
        const pendingStories = await Story.countDocuments({ isVerified: false });
        const activeReports = await Report.countDocuments({ status: 'pending' });

        res.json({
            totalUsers,
            pendingVerifications,
            pendingStories,
            activeReports
        });
    } catch (err) {
        res.status(500).send("Server Error fetching stats");
    }
};

// 2. GET PENDING VERIFICATIONS (Users who uploaded IDs)
exports.getPendingVerifications = async (req, res) => {
    try {
        const users = await User.find({ verificationStatus: 'pending' })
            .select('name email profession religion verificationDoc photos createdAt');
        res.json(users);
    } catch (err) {
        res.status(500).send("Server Error fetching verification queue");
    }
};

// 3. APPROVE/REJECT USER VERIFICATION
exports.handleUserVerification = async (req, res) => {
    try {
        const { status, note } = req.body; // 'verified' or 'rejected'
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ msg: "User not found" });

        user.verificationStatus = status;
        user.isVerified = (status === 'verified');
        // Optional: you can store the note in the user model if you added that field
        await user.save();

        res.json({ msg: `User ${status} successfully`, user });
    } catch (err) {
        res.status(500).send("Error updating user status");
    }
};

// 4. GET PENDING STORIES
exports.getPendingStories = async (req, res) => {
    try {
        const stories = await Story.find({ isVerified: false });
        res.json(stories);
    } catch (err) {
        res.status(500).send("Error fetching stories");
    }
};

// 5. APPROVE STORY
exports.approveStory = async (req, res) => {
    try {
        const story = await Story.findByIdAndUpdate(
            req.params.id, 
            { isVerified: true }, 
            { new: true }
        );
        res.json({ msg: "Story approved for public view", story });
    } catch (err) {
        res.status(500).send("Error approving story");
    }
};

// 6. POWER BI DATA EXPORT
exports.getAnalyticsData = async (req, res) => {
    try {
        const users = await User.find().select('gender religion profession annualIncome membership createdAt');
        res.json(users);
    } catch (err) {
        res.status(500).send("Error exporting data");
    }
};
exports.getStoryStats = async (req, res) => {
    try {
        const total = await Story.countDocuments();
        const approved = await Story.countDocuments({ isVerified: true });
        const pending = await Story.countDocuments({ isVerified: false });
        res.json({ total, approved, pending });
    } catch (err) {
        res.status(500).send("Error fetching story stats");
    }
};
exports.deleteStory = async (req, res) => {
    try {
        await Story.findByIdAndDelete(req.params.id);
        res.json({ msg: "Story removed successfully" });
    } catch (err) {
        res.status(500).send("Deletion failed");
    }
};
exports.getReportedChats = async (req, res) => {
    try {
        const reports = await Report.find({ status: 'pending' })
            .populate('reporter', 'name photos')
            .populate('reportedUser', 'name photos')
            .sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) { res.status(500).send("Server Error"); }
};

// 2. Get chat transcript for a specific report
exports.getReportTranscript = async (req, res) => {
    try {
        const messages = await Message.find({ conversationId: req.params.convId })
            .sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) { res.status(500).send("Error fetching transcript"); }
};

// 3. Take Action (Warn, Suspend, Ban)
exports.handleUserAction = async (req, res) => {
    try {
        const { action, reportId } = req.body; // 'warn', 'suspend', 'ban'
        const userId = req.params.userId;

        if (action === 'ban') {
            await User.findByIdAndUpdate(userId, { role: 'banned' });
        }
        
        // Mark report as resolved
        await Report.findByIdAndUpdate(reportId, { status: 'resolved' });

        res.json({ msg: `Action '${action}' applied and report resolved.` });
    } catch (err) { res.status(500).send("Action failed"); }
};