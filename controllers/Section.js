const Section=require("../models/Section");
const Course=require("../models/Course");
const subSection=require("../models/SubSection")

exports.createSection=async(req,res)=>{
    try {
        //data fetch
        const {sectionName,courseId}=req.body;
        //data validation
        if(!sectionName || !courseId)
        {
           return res.status(400).json({
            success:false,
            message:"Missing Properties",
           })
        }
        //create section
        const newSection=await Section.create({sectionName});
        
        //updated course with section ObjectId
        const updatedCourseDetails=await Course.findByIdAndUpdate(
                                                courseId,
                                                {
                                                    $push:{
                                                        courseContent:newSection._id,
                                                    }
                                                },
                                                //for getting updated document
                                                {new:true},    
                                            )
                                            .populate({
                                                path: "courseContent",
                                                populate: {
                                                    path: "subSection",
                                                },
                                            })
                                            .exec();
    
        //--------HW:  use populate in such a way that section and subsection both in the updated course details
        
        //return response

        return res.status(200).json({
            success:true,
            message:"Section created Successfully",
            updatedCourseDetails,
        })

        
       
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to create Section,please try again",
            error:error.message,
        });
    }
}

exports.updateSection=async(req,res)=>{
    try {
        //data input 
        const {sectionName,sectionId}=req.body;
        //data validation
        if(!sectionName || !sectionId)
            {
               return res.status(400).json({
                success:false,
                message:"Missing Properties",
               })
            }
        //update data
        const section=await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});

        //return res
        return res.status(200).json({
            success:true,
            message:"Section updated Successfully",
            // updatedCourseDetails,no passing as cahnge ho chuka hai
        });
       

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to update Section,please try again",
            error:error.message,
        });
    }
};

exports.deleteSection=async(req,res)=>{
    try {
        //getId-asssuming that we are sending Id in params
        const{sectionId}=req.params
        //find by Id and delete
        await Section.findByIdAndDelete(sectionId);
    
        //TODO (Testing) :do we need to delete the entry from course schema
        //return res
        return res.status(200).json({
            success:true,
            message:"Section Deleted Successfully",
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to update Section,please try again",
            error:error.message,
        });
    }
}