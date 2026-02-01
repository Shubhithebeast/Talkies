const {addMessage , getAllMessage, clearChat} = require("../controllers/messageControllers");


const router = require("express").Router();

router.post("/addmsg",addMessage);
router.post("/getmsg" , getAllMessage) ;
router.post("/clear", clearChat);


module.exports = router;