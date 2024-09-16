const mongoose= require("mongoose");

const sectionSchema=new mongoose.Schema({
    sectionName:{
       type:String,
    },
    subSection:[
        {
            types:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"subSection",
        }

    ],

});

module.exports=mongoose.model("Section",sectionSchema);