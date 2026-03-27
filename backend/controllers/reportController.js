const Report = require('../models/Report');

exports.reportUser = async (req, res) => {
    try {
        const reporterId = req.user.id; // From auth middleware
        const reportedUserId = req.params.id; // From URL /report/:id

        // 1. Prevent reporting yourself
        if (reporterId === reportedUserId) {
            return res.status(400).json({ msg: "You cannot report yourself" });
        }

        // 2. Create the report
        const newReport = new Report({
            reporter: reporterId,
            reportedUser: reportedUserId,
            reason: req.body.reason || "Inappropriate behavior reported from chat interface"
        });

        await newReport.save();

        res.status(201).json({ 
            success: true, 
            msg: "Thank you for the report. Our team will review this profile within 24 hours." 
        });

    } catch (err) {
        console.error("Report Error:", err.message);
        res.status(500).send("Server Error while submitting report");
    }
};