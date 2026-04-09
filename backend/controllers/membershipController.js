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
// Get current subscription info
exports.getSubscriptionInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('membership membershipExpiry name email');
        if (!user) return res.status(404).json({ msg: "User not found" });

        // Mocking a transaction ID for the UI
        const transactionId = "WDL-" + Math.random().toString(36).substr(2, 9).toUpperCase();

        res.json({
            plan: user.membership,
            expiry: user.membershipExpiry,
            transactionId: transactionId,
            amount: user.membership === 'Diamond' ? 89.00 : 29.00
        });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};
// Log a failed payment attempt for analytics
exports.logPaymentFailure = async (req, res) => {
    try {
        const { planType, reason } = req.body;
        console.log(`Payment Failed: User ${req.user.id} tried to buy ${planType}. Reason: ${reason}`);
        
        // In a real app, you might save this to a 'FailedTransactions' collection
        res.json({ success: true, msg: "Failure logged" });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};