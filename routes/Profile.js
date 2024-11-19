const express=require("express");
const router=express.Router();
const {auth,isInstructor}=require("../middlewares/auth");

const{updateProfile,
    deleteAccount,
    getAllUserDetails,updateDisplayPicture
}=require("../controllers/Profile");

//Profile routes

//Delete user Account
router.delete("/deleteProfile",auth,deleteAccount)
//update profile
router.put("/updateProfile",auth,updateProfile);

router.put("/updateDisplayPicture",auth,updateDisplayPicture);

//get all details of user
router.get("/getUserDetails",auth,getAllUserDetails);

module.exports=router;