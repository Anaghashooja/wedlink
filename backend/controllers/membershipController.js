const User = require('../models/User');

exports.upgradeMembership = async (req, res) => {
    try {
        const { plan } = req.body; // 'Gold' or 'Diamond'
        const userId = req.user.id;

        // Set expiry to 30 days from now
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { membership: plan, membershipExpiry: expiryDate },
            { returnDocument: 'after' }
        ).select("-password");

        res.json({
            msg: `Successfully upgraded to ${plan}!`,
            user: updatedUser
        });
    } catch (err) {
        res.status(500).send("Server Error during upgrade");
    }
};