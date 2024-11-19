const mongoose=require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        //giving expiry time of 5 min
        expires:5*60,
    },
});

// a function--- to send email
async function sendVerificationEmail(email,otp)// need email address of sender and otp to send
{
    try {
        const mailResponse=await mailSender(email,"Verification Email From AyushEdTech",emailTemplate(otp));
        console.log("Email Sent successfully",mailResponse);
    } catch (error) {
        //for good practice, writing like this
        console.log("error occured while sending mails:",error);
        throw error;
    }
}


//PRE-middleware 
//next is a function that is passed to middleware functions
// to indicate that the current middleware is done, and the next middleware in the stack should be executed
OTPSchema.pre("save",async function(next)
{
    await sendVerificationEmail(this.email,this.otp);
    next();
}
)
module.exports=mongoose.model("OTP",OTPSchema);
