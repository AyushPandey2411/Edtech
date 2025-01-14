const {instance}=require("../config/razorpay");
const Course=require("../models/Course");
const User=require("../models/User");

const mailSender=require("../utils/mailSender");
const {courseEnrollmentEmail}=require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");

//capture the payment and initiate the razorpay order
exports.capturePayment=async(req,res)=>{
      //get courseID and userId
      const {course_id}=req.body;
      const userId=req.user.id;
      //validation
      //valid course Id
      if(!course_id)
      {
        return res.json({
            success:false,
            message:"Please provide valid course ID",
        })
      };
      //valid course Detail
      let course;
      try {
        course=await Course.findById(course_id);
        if(!course)
        {
            return res.json({
                success:false,
                message:"Could not find the course",
            })
        }
        //user already pay for the same course
        const uid=new mongoose.Types.ObjectId(userId);
        if(course.studentEnrolled.includes(uid))
        {
            return res.status(200).json({
                success:false,
                message:"User is already registered",
            });
        }
      } catch (error) {
           console.log(error);
           return res.status(500).json({
            success:false,
            message:error.message,
           });
      }
      
      //order create
      const amount=course.price;
      const currency="INR";

      const options={
        amount:amount*100,
        currency,
        //optionals:
        receipt:Math.random(Date.now()).toString(),
        notes:{
            courseId:course_id,
            userId
        }
      }

    //   function for order creation
    try {
        //initiate the payment using razorpay
        const paymentResponse=await instance.orders.create(options);
        console.log(paymentResponse);

        //return response
        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:course.courseDescription,
            thumbnail:course.thumbnail,
            orderId:paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount,
        })
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:"Could not initiate order",
        })
    }
     
};

//verify signature Of Razorpay and Server
exports.verifySignature=async(req,res)=>{
    const webhookSecret="12345678";

    const signature=req.headers("x-razorpay-signature");

    const shashum=crypto.createHmac("sha256",webhookSecret);
    shashum.update(JSON.stringify(req.body));
    const digest=shashum.digest("hex");

    //matching
    if(signature==digest)
    {
        console.log("payment is authorized");

        const{courseId,userId}=req.body.payload.payment.entity.notes;

        try {
            //fulfill the action

            //find the course and enroll the student in it
            const enrolledCourse=await Course.findOneAndUpdate(
                                          {_id:courseId},
                                          {$push:{studentEnrolled:userId}},
                                          {new:true},      
            );

            if(!enrolledCourse)
            {
                return res.status(500).json({
                    success:false,
                    message:"Course not found",
                })

            }
          console.log(enrolledCourse);
          
          //find the student and add the course to their list of enrolled course
        const enrolledStudent=await User.findOneAndUpdate(
                                        {_id:userId},
                                        {$push:{courses:courseId}},
                                        {new:true}
        );
         
        console.log(enrolledStudent);

        //sending confirmation email
        const emailResponse=await mailSender(
                                    enrolledStudent.email,
                                    //Just Random Now
                                    "Congratulations from CodeHelp",
                                    "You are onboarded into the new Course",

        );
        console.log(emailResponse);

        return res.status(200).json({
            success:true,
            message:"Signature verified and Course added",
        });




        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });
        }
    }
        else{
              return res.status(400).json({
                success:false,
                message:"Invalid Request",
              })
        };
        


    }





