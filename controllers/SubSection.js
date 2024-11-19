const SubSection=require("../models/SubSection");
const Section=require("../models/Section");
const {uploadVideoToCloudinary}=require("../utils/image_VideoUploader");
//create SubSection

exports.createSubSection=async(req,res)=>{
    try {
        //fetch data from req body

        //getting section id also as koi section hai then only subsection create ho rha
        const{sectionId,title,timeDuration,description}=req.body;
        //extract file/video
        const video=req.files.video;
        //validation
        if(!sectionId ||!title ||!timeDuration ||!description||!video)
        {
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }    
        //upload video to cloudinary for getting secure URL
        const uploadDetails=await uploadVideoToCloudinary(video,process.env.FOLDER_NAME);

        //create a sub-section
        const subSectionDetails=await SubSection.create({
            title:title,
            timeDuration:`${uploadDetails.duration}`,
            description:description,
            videoUrl:uploadDetails.secure_url,

        })
        //update section with this subsection Object Id
        const updatedSection=await Section.findByIdAndUpdate({_id:sectionId},
                                                    {$push:{
                                                        subSection:subSectionDetails._id,
                                                    }},
                                                    {new:true},
        ).populate("subSection");
       //Done
        //Hw: log updated section here after adding populate query
        
        return res.status(200).json({ success: true, data: updatedSection })
        //return response
        // return res.status(200).json({
        //     success:true,
        //     message:"Sub section created Successfully",
        //     updatedSection,
        // })


    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:error.message
        })
    }
};