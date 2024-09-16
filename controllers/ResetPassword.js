
const User=require("../models/User");
const mailSender=require("../utils/mailSender");

//resetPasswordToken
exports.resetPasswordToken=async(req,res)=>{
    //get email from req body
    //check user for this email,email validation

    //frontend will run on 3000 port
    const url=`http://localhost:3000/update-password/${token}`
    

}
