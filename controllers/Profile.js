const Profile=require("../models/Profile");
const User=require("../models/User");

const { uploadImageToCloudinary } = require("../utils/image_VideoUploader")

exports.updateProfile=async(req,res)=>{
    try {
        //get data
        const {dateOfBirth="",about="",contactNumber,gender}=req.body;
        //get user id
        const id=req.user.id;
        //valiadtion
        if(!contactNumber ||!gender ||!id)
        {
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }
        //find profile jo bani hui hai
        const userDetails=await User.findById(id);
        const profileId=userDetails.additionalDetails;
        const profileDetails=await Profile.findById(profileId);

        //update profile
        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.about=about;
        profileDetails.gender=gender;
        profileDetails.contactNumber=contactNumber;
        await profileDetails.save();
        
        //return res
        return res.status(200).json({
            success:true,
            message:"Profile updated Successfully",
            profileDetails,
        })




    } catch (error) {
        return res.status(500).json({
            success:false,
            error:error.message,
        });
    }
};

//How can we schedule this deleteion operation

//delete account

exports.deleteAccount=async(req,res)=>{
    try {
       

        //logging for error
        console.log("Printing ID:",req.user.id);

         //get id
         const id=req.user.id;

        //validation
        const userDetails=await User.findById({_id: id });

        if(!userDetails)
        {
            return res.status(404).json({
                success:false,
                message:"User not found",
            });
        }
        //delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        
        //Todo :unenroll user from all enrolled courses
        
        //delete user
        await User.findByIdAndDelete({_id:id});
        

        //return response
        return res.status(200).json({
            success:true,
            message:"user deleted Successfully",
            profileDetails,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"user cannot be deleted successfully",
            
            error:error.message,
            
        });
    }
};

//getting all user details --- through following handler

exports.getAllUserDetails=async(req,res)=>{
    try {
        //get id
        const id=req.user.id;
        
        //validation and get user details
        const userDetails=await User.findById(id).populate("additionalDetails").exec();

        //return response
        return res.status(200).json({
            success:true,
            message:"User data fetched successfully",
            data:userDetails
        })


    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        }); 
    }
}

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
        
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }