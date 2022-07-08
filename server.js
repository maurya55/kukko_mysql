const express=require("express");
const app=express();
require("dotenv").config();
const PORT=process.env.PORT || 4400 ;
require("./server/model/configModel");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const cluster = require('cluster');
const os=require('os');

const v1Router=require("./server/router/index");




const numCPUs = os.cpus().length;
// console.log(os.cpus());
// console.log(numCPUs);
if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
   
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
   
    // This event is firs when worker died
    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  }
  else{

    app.listen(PORT,()=>{
        console.log(`App is listen of port ${PORT}`);
    })

  }


// app.listen(PORT,()=>{
//     console.log(`App is listen of port ${PORT}`);
// })





app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev'));




v1Router(app);



//==========error handling =========

app.use((err,req,res,next)=>{

  let errorCode=err.statusCode || 500;
    return res.status(errorCode).json({
      status:false,
      message:err.message,
      error: process.env.NODE_ENV == "developmet" ?  err.stack : null
    })

})



