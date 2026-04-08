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
exports.confirmPayment = async (req, res) => {
    try {
        const { planType, paymentDetails } = req.body; 
        const userId = req.user.id;

        // In a real app, you would validate the 'paymentDetails' with Stripe here.
        // If successful, we update the user:
        
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30); // 30 days validity

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                membership: planType, 
                membershipExpiry: expiryDate 
            },
            { new: true }
        ).select("-password");

        res.json({
            success: true,
            msg: `Payment Successful! You are now a ${planType} member.`,
            user: updatedUser
        });
    } catch (err) {
        res.status(500).send("Payment Processing Error");
    }
};