const express=require("express");

const router=express.Router();
const testingController=require("../../controller/testingController");


router.get("/testEmiter",testingController.eventEmitter);
router.get("/importExcel",testingController.importExcel);



module.exports=router;