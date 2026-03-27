const Message = require('../models/Message');
const Request = require('../models/Request');

// Get list of conversations (People I've chatted with or accepted)
exports.getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // 1. Get all accepted connections (New Matches)
        const connections = await Request.find({
            $or: [{ sender: userId }, { receiver: userId }],
            status: 'accepted'
        }).populate('sender receiver', 'name photos profession religion');

        // 2. Format connections to get the "Other User"
        const partners = connections.map(conn => 
            conn.sender._id.toString() === userId ? conn.receiver : conn.sender
        );

        res.json(partners);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};
exports.getChatHistory = async (req, res) => {
  try {
    const { otherId } = req.params;
    const myId = req.user.id;

    // Fetch messages where I am sender and they are receiver OR vice versa
    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: otherId },
        { sender: otherId, receiver: myId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};