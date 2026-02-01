const {register,login, setAvatar, getAllUsers, updateProfile} = require("../controllers/userControllers");

const router = require("express").Router();
 
router.post("/register",register); 
router.post("/login",login); 
router.post("/setavatar/:id",setAvatar);
router.post("/updateprofile/:id", updateProfile);
router.get("/allusers/:id",getAllUsers);
 
module.exports = router;  