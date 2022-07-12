
const { check } = require("express-validator");
// const ObjectId = require('mongoose').Types.ObjectId;


exports.register = [
    check("name", "name field is required")
        .notEmpty()
        .trim(),
    check("email", "email is required")
        .isEmail(),
    check("password", "password is required")
        .notEmpty()
        .trim(),
    check("confirm_password", "confirm password is required")
        .notEmpty()
        .trim()
        .custom((val, { req, loc, path }) => {
            if (true) {
                if(val!=req.body.password)
                {
                   
                    throw new Error("password and confirm password not match");
                }
                // console.log(val,req.body.password); 
                // console.log()
                return val;
            }
        })

]


//===========otp validation===========
exports.verifyOtp=[
    check("otp","valid otp is required")
    .notEmpty()
    .trim()
    .isLength({min: 4, max:4}),
    check("id","id is required")
    .notEmpty()
    .trim()
]


//======login validation=======

exports.login=[
    check("email","email is required")
    .notEmpty()
    .trim(),
    check("password","password is required")
    .notEmpty()
    .trim()
    

]