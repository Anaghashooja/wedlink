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
const io = new Server(server);  
dotenv.config();


app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Match your frontend port
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.set("socketio", io);    
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join_room", (data) => {
        socket.join(data.room);
        console.log(`User ${data.user} joined room ${data.room}`);
    });

    socket.on("send_message", (data) => {
        // Send to everyone in the room
        io.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});
app.use(express.json());
 mongoose.connect(process.env.MONGODB_URI)
 .then(() => console.log("MongoDB connected"))
 .catch(err => console.log(err)) ;
 app.use('/api/auth', require('./routes/auth'));
 app.use('/api/requests', require('./routes/request'));
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