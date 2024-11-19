const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        //using enum as 3 types account can be made
        enum:["Admin","Student","Instructor"],
        required:true,
    },
    additionalDetails:{
        //mongoose.Schema.Types.ObjectId is used to define a field in a schema that references another document's _id field. It's commonly used to create 
        //relationships between documents, such as in one-to-many or many-to-many associations.
       
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        //we will be referring 'profile' model for this
        ref:"Profile"

    },
    courses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course",
        }
    ],
    image:{
        type:String, //as will be giving url
        required:true,
    },

    //----adding for reset password
    token:{
        type:String,
    },
    resetPasswordExpires:{
        type:Date,
    },


    //many courses can be there so adding courseProgress in an Array
    
    courseProgress:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"CourseProgress",
        }
    ]


});

//exporting:
module.exports=mongoose.model("User",userSchema);
