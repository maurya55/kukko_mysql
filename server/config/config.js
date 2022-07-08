const Sequelize=require("sequelize");
require("dotenv").config();


const sequelize=new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
         // Explicitly specifying 
        // mysql database
        dialect: 'mysql',
  
        // By default host is 'localhost'           
        host: process.env.DB_HOST
    }
)

module.exports=sequelize;