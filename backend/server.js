const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); 
const { Server } = require("socket.io");  
const app = express();
const port = 3000;
const http = require("http");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});  
dotenv.config();


app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], // Allow both common Vite ports
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.set("socketio", io);    
io.on('connection', (socket) => {
  
  socket.on('join_chat', (data) => {
    socket.join(data.room);
  });

  socket.on('send_message', async (data) => {
    try {
      const Message = require('./models/Message');
      const newMsg = new Message({
        conversationId: data.room,
        sender: data.sender,
        receiver: data.receiver,
        text: data.text,
        createdAt: data.createdAt
      });
      await newMsg.save();
      
      // Send to the OTHER person in the room only
      socket.to(data.room).emit('receive_message', data);
    } catch (err) {
      console.error("Socket Error:", err);
    }
  });
});
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI)
 .then(() => console.log("MongoDB connected"))
 .catch(err => console.log(err)) ;
 const authRoutes = require('./routes/auth');
 app.use('/api/auth', authRoutes);
 app.use('/api/requests', require('./routes/request'));
 app.use('/api/messages', require('./routes/message'));
 app.use('/api/stories', require('./routes/story'));
 app.use('/api/membership', require('./routes/membership'));
 app.use('/api/admin', require('./routes/admin'));
 app.use('/api/user', require('./routes/user'));  
 app.use('/api/notifications', require('./routes/notification'));
 app.use('/api/policy', require('./routes/policy'));
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Global Error Handler to catch hidden errors
app.use((err, req, res, next) => {
    console.error("EXPRESS ERROR:", err);
    res.status(500).json({ msg: err.message || "Internal Server Error" });
});

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});