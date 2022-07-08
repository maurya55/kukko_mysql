
const db = require("../model/configModel");
const userModel = db.User;

const { validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler')
const emailService = require("../services/email.service");
const { emailTemplate } = require("../template/register");
const becrypt = require("../services/bcrypt.service");
const { webToken } = require("../services/token.service");


exports.register = asyncHandler(async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    // throw new Error("password and confirm password not match");

    const { name, email, mobile, age, password } = req.body;

    try {


        let otp = Math.floor(1000 + Math.random() * 9000);

        await userModel.destroy({ where: { email: email, isVerified: false } });

        let checkUser = await userModel.findOne({
            where: { email: email }
        })

        if (checkUser) {
            return res.status(409).json({
                status: false,
                message: `${email} is already registerd`
            })
        }

        let becryptOtp = await becrypt.becryptData(otp);
        console.log(otp);
        const resData = await userModel.create({
            name: name,
            email: email,
            mobile: mobile,
            verifiedOtp: becryptOtp,
            otpExpire: Date.now(),
            age: age,
            password: password
        })


        if (!resData) {
            return res.status(500).json({
                status: false,
                message: "data not stored"
            })
        }
        else {

            let template = await emailTemplate(otp);
            let emailData = {
                template: template,
                email: email
            }

            let sendEmail = await emailService.sendEmail(emailData, res);
            let statuCode = sendEmail.status ? 200 : 500;

            return res.status(statuCode).json({
                status: sendEmail.status,
                data: sendEmail.message,
                id: resData.id
            })
        }

    } catch (error) {

        var err = new Error(error);
        err.statusCode = 500;
        throw err;

    }


})


//============Verify Otp==============

exports.verifyOtp = asyncHandler(async (req, res) => {

    const { otp, id } = req.body;
    try {
        const checkUser = await userModel.findByPk(id);


        if (!checkUser) {
            var err = new Error("User not found")
            err.statusCode = 404;
            throw err;

        }
        // console.log((checkUser.otpExpire+(5*60000)>=Date.now()))
        if ((checkUser.otpExpire + (5 * 60000) <= Date.now())) {
            // return res.status(401).json({
            //     data: false,
            //     message: "Otp expire"
            // })

            var err = new Error("Otp expire")
            err.statusCode = 401;
            throw err;
        }

        let checkBecrypt = await becrypt.becryptCompare(otp, checkUser.verifiedOtp);
        // console.log(checkBecrypt);
        if (!checkBecrypt) {
            // return res.status(401).json({
            //     status: false,
            //     message: "otp not match"
            // })

            var err = new Error("otp not match")
            err.statusCode = 401;
            throw err;
        }
        else if (checkBecrypt) {

            let checkUpdate = await userModel.update({
                isVerified: true
            },
                { where: { id: checkUser.id } }
            )

            if (!checkUpdate) {
                // return res.status(401).json({
                //     status: false,
                //     message: "user not verifed"
                // })

                var err = new Error("user not verifed")
                err.statusCode = 401;
                throw err;
            }
            else {
                var token = await webToken(checkUser._id);
                return res.status(200).json({
                    status: true,
                    token: token
                })
            }

        }

    }
    catch (error) {
        var err = new Error(error);
        err.statusCode = error.statusCode;
        throw err;

    }

})



