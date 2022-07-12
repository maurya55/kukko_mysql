const express=require("express");
const app=express();
require("dotenv").config();
require("./server/model/configModel");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
var cors = require('cors')
var hpp = require('hpp');
const NodeRSA = require('node-rsa');
const key = new NodeRSA({b: 512});
var xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize');

const v1Router=require("./server/router/index");
const {GoogleSocialLogin,FacebookSocialLogin}=require("./app/social");
const {cluster}=require("./app/cluster");
const swagger=require("./app/swagger");




  
  // const text = 'Hello RSA!';
  // const encrypted = key.encrypt(text, 'base64');
  // console.log('encrypted: ', encrypted);
  // const decrypted = key.decrypt(encrypted, 'utf8');


  // console.log('decrypted: ', decrypted);

// app.listen(PORT,()=>{
//     console.log(`App is listen of port ${PORT}`);
// })



cluster(app);

GoogleSocialLogin(app);
FacebookSocialLogin(app);

swagger(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(hpp());
app.use(xss());
app.use(mongoSanitize());
app.use(cors());




//============router==========
v1Router(app);

//==============api not fund =============
app.use("*",(req,res)=>{
  res.status(200)
  throw new Error('api not found '+ `${req.originalUrl}`);
})
//==========error handling =========

app.use((err,req,res,next)=>{

  let errorCode=err.statusCode || 500;
    return res.status(errorCode).json({
      status:false,
      message:err.message,
      error: process.env.NODE_ENV == "developmet" ?  err.stack : null
    })

})



