const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require("./routes/userRoutes")
const messageRoutes = require("./routes/messagesRoute");
const socket = require("socket.io");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth",userRoutes);
app.use("/api/messages",messageRoutes);

app.get('/',(req,res)=>{
    res.send("Hii, I am Working...");
})


const PORT = process.env.PORT;
const URL = process.env.MONGO_URL;
// console.log(URL);

const db_connect = async()=>{
    try{
        await mongoose.connect(URL,{
            useNewUrlParser:true,useUnifiedTopology:true,
        })
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