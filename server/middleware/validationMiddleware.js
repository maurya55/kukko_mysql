
const { check } = require("express-validator");

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