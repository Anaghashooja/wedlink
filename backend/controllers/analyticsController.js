const User = require('../models/User');
const Request = require('../models/Request');

exports.getPowerBIData = async (req, res) => {
    try {
        // 1. Fetch all users (excluding passwords)
        const users = await User.find().select('gender religion profession annualIncome membership isVerified createdAt dateOfBirth');

        // 2. Fetch all requests to track platform activity
        const requests = await Request.find().select('status createdAt');

        // 3. Optional: Flatten/Transform data for easier BI modeling
        const flattenedUsers = users.map(user => {
            // Calculate age on server to save time in Power BI
            const age = user.dateOfBirth 
                ? Math.floor((new Date() - new Date(user.dateOfBirth)) / 31557600000) 
                : null;

            return {
                id: user._id,
                gender: user.gender || 'Not Specified',
                religion: user.religion || 'Unknown',
                profession: user.profession || 'Other',
                income: user.annualIncome || '0',
                membership: user.membership || 'Free',
                isVerified: user.isVerified ? 'Verified' : 'Unverified',
                registrationDate: user.createdAt,
                age: age
            };
        });

        res.json({
            users: flattenedUsers,
            totalRequests: requests.length,
            requestTrends: requests // Power BI can count 'accepted' vs 'rejected' here
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error generating BI data");
    }
};