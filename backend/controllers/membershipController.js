const User = require('../models/User');
const Notification = require('../models/Notification');

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

        const dbNotification = new Notification({
            receiver: userId,
            title: `Welcome to ${plan}!`,
            message: "Your membership has been successfully upgraded. Enjoy your exclusive features.",
            type: 'system'
        });
        await dbNotification.save();

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

        const dbNotification = new Notification({
            receiver: userId,
            title: `Welcome to ${planType}!`,
            message: "Your transaction was successful. Dive into your upgraded experience.",
            type: 'system'
        });
        await dbNotification.save();

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
const PDFDocument = require('pdfkit');

exports.generateReceipt = async (req, res) => {
  try {
    // 1. Get data (In a real app, fetch this from your DB using req.user.id)
    // For this example, we'll assume data is passed or fetched based on user
    const receiptData = {
      orderId: req.params.transactionId || "WL-" + Math.floor(Math.random() * 1000000),
      date: new Date().toLocaleDateString(),
      plan: "Premium", // Mocked - fetch from DB
      amount: "99.00",
      customerName: "Valued Member"
    };

    const doc = new PDFDocument({ margin: 50 });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt-${receiptData.orderId}.pdf`);

    // Pipe the PDF into the response
    doc.pipe(res);

    // --- PDF DESIGN ---
    // Header
    doc.fillColor('#6f2434').fontSize(25).text('WEDLINK', { align: 'center' });
    doc.fontSize(10).fillColor('#666666').text('Official Payment Receipt', { align: 'center' });
    doc.moveDown();

    // Divider
    doc.moveTo(50, 120).lineTo(550, 120).stroke('#eeeeee');

    // Details
    doc.moveDown(2);
    doc.fillColor('#000000').fontSize(12).text(`Date: ${receiptData.date}`);
    doc.text(`Transaction ID: ${receiptData.orderId}`);
    doc.moveDown();

    // Table Header
    doc.fillColor('#f9fafb').rect(50, 200, 500, 30).fill();
    doc.fillColor('#6f2434').text('Description', 60, 210);
    doc.text('Amount', 450, 210, { align: 'right' });

    // Table Body
    doc.fillColor('#333333').text(`${receiptData.plan} Membership Subscription`, 60, 250);
    doc.text(`$${receiptData.amount}`, 450, 250, { align: 'right' });

    // Total
    doc.moveTo(50, 280).lineTo(550, 280).stroke('#eeeeee');
    doc.fontSize(15).fillColor('#6f2434').text('Total Paid:', 350, 300);
    doc.text(`$${receiptData.amount}`, 450, 300, { align: 'right' });

    // Footer
    doc.fontSize(10).fillColor('#999999').text(
      'Thank you for choosing Wedlink. Your journey begins here.',
      50, 700, { align: 'center', width: 500 }
    );

    doc.end();

  } catch (error) {
    console.error("PDF Gen Error:", error);
    res.status(500).json({ message: "Error generating receipt" });
  }
};