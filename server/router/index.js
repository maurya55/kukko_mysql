
const router=require("./v1/index");

module.exports=(app)=>{


app.use("/mob/v1",router);


}