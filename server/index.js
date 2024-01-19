const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose');


require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());


const PORT = process.env.PORT;
const URL = process.env.MONGO_URL;

const db_connect = async()=>{
    try{
        await mongoose.connect(URL,{
            useNewUrlParser:true,useUnifiedTopology:true,
        })
        console.log("Database connected successfully...");
    }catch(error){
        console.log("Error in connecting Database",error);
    }
}
db_connect();


const server = app.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}`)
})