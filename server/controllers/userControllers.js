const User = require("../models/userModel");
const bcrypt = require("bcryptjs");


module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ status: false, msg: "All fields are required" });
        }
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck)
            return res.status(409).json({ msg: "Username already used", status: false });

        const emailCheck = await User.findOne({ email });
        if (emailCheck)
            return res.status(409).json({ msg: "Email already used", status: false });

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            username,
            password: hashPassword,
        });
        // Convert to plain object and remove password
        const userObj = user.toObject();
        delete userObj.password;
        return res.status(201).json({ status: true, user: userObj });
    } catch (error) {
        next(error);
    }
};

module.exports.login = async(req,res,next)=>{
    try{
        const {username,password} = req.body;

        const user = await User.findOne({username});
        if(!user){
            return res.json({msg:"Username not found",status:false});
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);
        if (!isPasswordValid){
            return res.json({msg:"Incorrect Password",status:false});
        }

        delete user.password;
        return res.json({msg:"User Logined",status:true,user});

    }catch(error){
        next(error);
    }
}
 

module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        if (!userId || !avatarImage) {
            return res.status(400).json({ status: false, error: 'User ID and image are required' });
        }
        const userData = await User.findByIdAndUpdate(
            userId,
            {
                isAvatarImageSet: true,
                avatarImage,
            },
            { new: true }
        );
        if (!userData) {
            return res.status(404).json({ status: false, error: 'User not found' });
        }
        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });
    } catch (error) {
        next(error);
    }
};


module.exports.getAllUsers = async (req, res, next) => {
    try {
      const users = await User.find({ _id: { $ne: req.params.id } }).select([
        "email",
        "username",
        "avatarImage",
        "_id",
      ]);
    //   console.log("users: ",users);
      return res.json(users);
    } catch (ex) {
      next(ex);
    }
  };

module.exports.updateProfile = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { username, avatarImage } = req.body;
        
        const updateData = {};
        if (username) updateData.username = username;
        if (avatarImage) updateData.avatarImage = avatarImage;
        
        const userData = await User.findByIdAndUpdate(userId, updateData, { new: true });
        
        if (!userData) {
            return res.status(404).json({ status: false, msg: "User not found" });
        }
        
        delete userData.password;
        return res.json({
            status: true,
            user: userData,
        });
    } catch (error) {
        next(error);
    }
};
