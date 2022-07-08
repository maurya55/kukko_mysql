const express=require("express");

const router=express.Router();

const userController=require("../../controller/userController");
const validation=require("../..//middleware/validationMiddleware");

router.post("/register",validation.register,userController.register);
router.post("/verifyOtp",validation.register,userController.verifyOtp);


module.exports=router;