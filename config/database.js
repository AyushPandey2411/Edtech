const mongoose=require("mongoose");

require("dotenv").config();

exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL,{

        //------not supported now------
        // useNewUrlParse:true,
        // useUnifiedTopology:true,
    })
    .then(()=>{console.log("DB connected successfully")})
    .catch((err)=>{
        console.log("DB connection failed");
        console.error(err);
        //exiting the process as problem
        process.exit(1);
    })
}