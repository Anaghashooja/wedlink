const Request = require('../models/Request');
const User = require('../models/User');
const Notification = require('../models/Notification');
const sendEmail = require('../config/email');
const sendPush = require('../config/firebase');
exports.sendRequest = async (req, res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.user.id;
        const senderName = req.user.name;

        // 1. Prevent connecting with yourself
        if (senderId === receiverId) {
            return res.status(400).json({ msg: "You cannot connect with yourself" });
        }

        // 2. Check if a request already exists between these two
        const existingRequest = await Request.findOne({
            sender: senderId,
            receiver: receiverId
        });

        if (existingRequest) {
            return res.status(400).json({ msg: "Connection request already sent" });
        }

        // 3. Create the request
        const newRequest = new Request({
            sender: senderId,
            receiver: receiverId
        });

        await newRequest.save();
        res.json({ msg: "Interest sent successfully!" });

        // 4. Notifications (Socket, Email, Push, DB)
        const io = req.app.get("socketio");
        const receiver = await User.findById(receiverId);

        // a. In-App DB Notification
        const dbNotification = new Notification({
            receiver: receiverId,
            sender: senderId,
            title: "New Connection Request 💖",
            message: `${senderName} wants to connect with you.`,
            type: 'connection'
        });
        await dbNotification.save();

        // a. Real-time Socket
        io.to(receiverId).emit("new_interest", {
            senderId,
            senderName,
            receiverId,
            message: "New interest request"
        }); 

        // b. Email Alert
        if (receiver && receiver.email) {
            sendEmail(
                receiver.email, 
                "New Interest on Wedlink 💖", 
                `Hi ${receiver.name}, ${senderName} has sent you a connection request! Check your Wedlink Inbox.`
            );
        }

        // c. Push Notification
        if (receiver && receiver.fcmToken) {
            sendPush(
                receiver.fcmToken,
                "New Interest! 💖",
                `${senderName} sent you a connection request.`
            );
        }

    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
    
};
exports.getReceivedRequests = async (req, res) => {
    try {
        const requests = await Request.find({ 
            receiver: req.user.id,
            status: 'pending' // Only show new ones
        }).populate('sender', 'name photos profession religion'); // Get sender details
        
        res.json(requests);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};


// Update Request Status (Accept or Reject)
exports.updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body; // Expecting 'accepted' or 'rejected'
        const request = await Request.findById(req.params.id);

        if (!request) return res.status(404).json({ msg: "Request not found" });

        // Security check: Only the receiver can accept/reject the request
        if (request.receiver.toString() !== req.user.id) {
            return res.status(401).json({ msg: "Unauthorized" });
        }

        request.status = status;
        await request.save();

        res.json({ msg: `Successfully ${status} the connection request.` });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};
exports.getPendingCount = async (req, res) => {
    try {
        const count = await Request.countDocuments({ 
            receiver: req.user.id, 
            status: 'pending' 
        });
        res.json({ count });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};