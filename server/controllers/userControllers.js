const User = require("../models/userModel");
const bcrypt = require("bcrypt");

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
    const user = User.create({
        email,username,password:hashPassword,
    });

    // delete user.password;
    return res.json({status:true,msg:"User created ",user});
    }catch(error){
        next(error);
    }
};