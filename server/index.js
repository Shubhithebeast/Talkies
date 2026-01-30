const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require("./routes/userRoutes")
const messageRoutes = require("./routes/messagesRoute");
const socket = require("socket.io");
const avatarRoutes = require("./routes/avatarRoutes");

const app = express();
require('dotenv').config({ path: __dirname + '/.env' });
// console.log("PORT:", process.env.PORT, "URL:", process.env.MONGO_URL);



app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/avatar", avatarRoutes);

app.get('/', (req, res) => {
    res.send("Hii, I am Working...");
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("[ERROR]", err);
    res.status(500).json({ status: false, error: err.message || "Internal Server Error" });
});


const PORT = process.env.PORT || 5000;
const URL = process.env.MONGO_URL;
// console.log(PORT, "--", URL);

const db_connect = async()=>{
    try{
        await mongoose.connect(URL);
        // console.log(URL);
        console.log("Database connected successfully...");
    }catch(error){
        console.log("Error in connecting Database",error);
    }
}
db_connect();


const server = app.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}`)
})

//creating an Socket.io instance ->io by passing server object
const io = socket(server,{
    cors:{
        // Specifies the allowed origins for cross-origin requests. 
        // allowing requests from the specified origin.
        origin:process.env.ORIGIN,

        // allows sending cookies, HTTP authentication, 
        // and client-side SSL certificates.
        credentials:true,
    },
});

// map will be used to store online users' IDs and 
// their corresponding socket IDs.
global.onlineUsers = new Map();

// listens for incoming socket connections. When a client connects 
// to the server, the provided callback function is executed
//  with the socket object representing the connection.
io.on("connection",(socket)=>{
    global.chatSocket = socket;

    // listens  "add-user" event from the client. 
    // When event is received, callback function is executed with the userId
    socket.on("add-user", (userId)=>{
        // adding entry in  onlineUsers map,
        // associating the userId with the socket.id.
        onlineUsers.set(userId, socket.id);
    })

    socket.on("send-msg", (data)=>{
        // console.log("send-msg",{data});

        // console.log("onlineUsers keys:", Array.from(onlineUsers.keys()));

        // retrieves the socket ID of the recipient user (data.to)  from amp
        const sendUserSocket =  onlineUsers.get(data.to);
        // console.log("sendUserSocket",sendUserSocket);


        // f the recipient's socket ID is found in the onlineUsers map. 
        // If the recipient is online further code execute
        if(sendUserSocket){
            // console.log("inside sendUserSocket");
            socket.to(sendUserSocket).emit("msg-receive",data.msg);
        }
    }) 
})