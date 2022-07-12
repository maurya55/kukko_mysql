const express=require("express");

const router=express.Router();

const userController=require("../../controller/userController");
const validation=require("../..//middleware/validationMiddleware");



router.get("/googleLogin",(req,res)=>{
    res.send("google login");
})





router.post("/register",validation.register,userController.register);
router.post("/verifyOtp",validation.verifyOtp,userController.verifyOtp);
router.post("/login",validation.login,userController.login);


module.exports=router;