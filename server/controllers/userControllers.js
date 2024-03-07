const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

module.exports.register = async(req,res,next)=>{
    // console.log(req.body);

    try{
        const {username,email,password} = req.body;

    const usernameCheck = await User.findOne({username});
    if(usernameCheck)
        return res.json({msg:"Username already used",status:false});
    
    const emailCheck = await User.findOne({email});
    if(emailCheck)
        return res.json({msg:"Email already used",status:false});

    const hashPassword = await bcrypt.hash(password,10);
    // Issue no.2 IssueFaced.md
    const user = await User.create({ 
        email,username,password:hashPassword,
    });
    // console.log("userController register:");
    // console.log(user);
    // console.log("username,email,pass: ",username," ",email," ",password);
    // console.log(user);

    delete user.password;
    // console.log("user,email,pass: ",username," ",email," ",password);
    
    return res.json({status:true,user});
    }catch(error){
    // console.log("username,email,pass: error",username," ",email," ",password);
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
 
module.exports.setAvatar = async(req,res,next)=>{
    try{
        const userId = req.params.id;
        const avatarImage = req.body.image;

         // Check if userId is valid
         if (!userId) {
            return res.json({ error: 'User ID is required',status:false });
        }

        const userData = await User.findByIdAndUpdate(
            userId,
            {
            isAvatarImageSet:true, 
            avatarImage,
            },
            {new : true}
        ) 

        return res.json({
            isSet:userData.isAvatarImageSet,
            image:userData.avatarImage,
        });

    }catch(error){
        next(error);
    } 
}


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
