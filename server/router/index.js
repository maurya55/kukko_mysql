
const router=require("./v1/index");
const testing=require("./v1/testing");


module.exports=(app)=>{


app.use("/mob/v1",router);
app.use("/testing",testing);

}