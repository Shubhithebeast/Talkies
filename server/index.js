const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require("./routes/userRoutes")
const messageRoutes = require("./routes/messagesRoute");


const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth",userRoutes);
app.use("/api/messages",messageRoutes);


const PORT = process.env.PORT || 5000;
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