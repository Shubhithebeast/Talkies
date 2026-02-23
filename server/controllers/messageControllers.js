const messageModal = require("../models/messageModal");

module.exports.addMessage = async(req,res,next)=>{
    try{
        
        const {from, to, message, messageType = "text", attachment = null} = req.body;

        if (messageType === "text" && (!message || !message.trim())) {
            return res.status(400).json({ msg: "Message text is required." });
        }

        if (messageType === "file" && (!attachment || !attachment.data)) {
            return res.status(400).json({ msg: "Attachment payload is required for file message." });
        }

        const data = await messageModal.create({
            message: {
                text: message || "",
                type: messageType,
                attachment: attachment || undefined,
            },
            users:[from,to],
            sender:from,
        });

        if(data) return res.json({msg:"Message added successfully..."});

        return res.json({msg: "Failed to add message in Database..."});
   
    }catch(error){
        next(error);
    }
    
}

module.exports.getAllMessage = async(req,res,next)=>{
    try{
        const {from, to} = req.body;

        const messages = await messageModal.find({
            users:{
                $all:[from,to],
            }
        }).sort({updatedAt:1});

        const projectMessages = messages.map((msg)=>{
            return{
                fromSelf : msg.sender.toString() === from,
                message: msg.message.text,
                messageType: msg.message.type || "text",
                attachment: msg.message.attachment || null,
                createdAt: msg.createdAt,
            }
        })

        res.json(projectMessages);
    }catch(error){
        next(error);
    }
    
}

module.exports.clearChat = async (req, res, next) => {
    try {
        const { from, to } = req.body;
        await messageModal.deleteMany({
            users: {
                $all: [from, to],
            },
        });
        res.json({ status: true, msg: "Chat cleared successfully" });
    } catch (error) {
        next(error);
    }
};
