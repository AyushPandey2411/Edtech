const Course = require("../models/Course");
const Category= require("../models/category");
const User = require("../models/User");

//uploading image utility
const { uploadImageToCloudinary } = require("../utils/image_VideoUploader");

//create Course handler function
exports.createCourse = async (req, res) => {
  try {
    //fetch data
    const { courseName, courseDescription, whatYouWillLearn, price, category } =
      req.body;

    //get thumbnail
    const thumbnail = req.files.thumbnailImage;

    //validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      
      !thumbnail ||
      !category
      
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //check for instructor (yet we did in middlewares -auth.js but we need instructor for course creation)
    const userId = req.user.id; //req have id as id given in payload
    const instructionDetails = await User.findById(userId);
    console.log("Instructor details:", instructionDetails);

    //TODO:   verify that userId,instructorDetails._id are same or different

    //done
    const instructorDetails = await User.findOne({ _id: userId, accountType: "Instructor" });

    if (!instructionDetails) {
      return res.status(401).json({
        success: false,
        message: "Instructor details not found",
      });
    }
    //check given category is valid or not
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details not found",
      });
    }

    //upload Image To cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    //create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id, //this is why instructor details were fetched
      price,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    //user i.e. instructor update
    //---- add the new course to the user schema of Instructor

    await User.findByIdAndUpdate(
      {
        _id: instructionDetails._id,
      },
      //course ke andar course ki id insert
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );
    //update the category ka schema --- TODO

    //.................

    //return response
    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

//------ get all courses handler function

exports.showAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      //  ----- TODO:will add it later
    //   {
    //     courseName: true,
    //     price: true,
    //     thumbnail: true,
    //     instructor: true,
    //     ratingAndReviews: true,
    //     studentsEnrolled: true,
    //   }
    )
      .populate("instructor")
      .exec();
    return res.status(200).json({
      success: true,
      message: "Data for all courses fetched",
      data: allCourses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Some error occurred ,Cannot fetch course data",
      error: error.message,
    });
  }
};


//getCoursedetails
exports.getCourseDetails=async(req,res)=>{
  try {
         //get id
         const {courseId}=req.body;
         //find course details
         const courseDetails=await Course.find(
                                      {_id:courseId}
                                    ).populate(
                                      {
                                        path:"instructor",
                                        populate:{
                                          path:"additionalDetails",
                                        }
                                      }
                                    )
                                    .populate("category")
                                    .populate("ratingAndReviews")
                                    .populate({
                                        path:"courseContent",
                                        populate:{
                                          path:"subSection",
                                        },
                                    })
                                    .exec();
                      //validation
                      
                      if(!courseDetails)
                      {
                        return res.status(400).json({
                          success:false,
                          message:`Could not find the course with id ${courseId}`,
                        })
                      }
                      //return response
                      return res.status(200).json({
                        success:true,
                        message:"Course Details fetched Successfully",
                        data:courseDetails,
                      })

  } catch (error) {
        console.log(error);
        return res.status(500).json({
          success:false,
          message:error.message,
        })
  }
}