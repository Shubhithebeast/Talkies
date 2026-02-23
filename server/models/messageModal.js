const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    message:{
        text:{
            type:String,
            default:"",
        },
        type: {
            type: String,
            enum: ["text", "file"],
            default: "text",
        },
        attachment: {
            fileName: { type: String, default: "" },
            fileType: { type: String, default: "" },
            fileSize: { type: Number, default: 0 },
            data: { type: String, default: "" },
        },
    },
    users:Array,
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }

},{
    timestamps:true,
})

module.exports = mongoose.model("Messages",messageSchema);
