const express = require("express");
const router = express.Router();

//CourseControllers import
const {
  createCourse,
  getCourseDetails,
  showAllCourses,
} = require("../controllers/Course");

const {
  createCategory,
  showAllCategory,
  categoryPageDetails,
} = require("../controllers/Category");
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");

const { createSubSection } = require("../controllers/SubSection");

const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReview");

//importing middlewares
const { auth,isInstructor,isStudent,isAdmin,}=require("../middlewares/auth");

//course Routes

//course can only be created by instructor
router.post("/createCourse",auth,isInstructor,createCourse);
router.post("/addSection",auth,isInstructor,createSection);
router.post("/updateSection",auth,isInstructor,updateSection);
router.delete("/deleteSection",auth,isInstructor,deleteSection);
// Add a Sub Section to a Section


router.post("/addSubSection", auth, isInstructor, createSubSection)
//getAllCourses
router.get("/getAllCourses",showAllCourses)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)

// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategory)
router.post("/getCategoryPageDetails", categoryPageDetails)

//Ratin and Review routes
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

module.exports=router;