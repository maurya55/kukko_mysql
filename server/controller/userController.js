
const db = require("../model/configModel");
const userModel = db.User;

const { validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler')
const emailService = require("../services/email.service");
const { emailTemplate } = require("../template/register");
const becrypt = require("../services/bcrypt.service");
const { webToken } = require("../services/token.service");
const { v4: uuidv4 } = require('uuid')

//===================new user registration ============
exports.register = asyncHandler(async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    console.log(req.body);
    // throw new Error("password and confirm password not match");

    const { name, email, mobile, password } = req.body;

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
                email: email,
                subject: "Kukko Registration Otp"
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

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    const { otp, id } = req.body;

    try {
        // const userId = uuidv4() 
        // console.log(userId);
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
                var token = await webToken(checkUser.id);
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



// ==================Login =============

exports.login = asyncHandler(async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    const { email, password } = req.body;


    try {
        const userData = await userModel.findOne({ where: { email: email } });
        if (!userData) {
            return res.status(404).json({
                status: false,
                message: "user not found"
            })
        }

        let checkPassword = await becrypt.becryptCompare(password, userData.password)

        if (!checkPassword) {
            return res.status(401).json({
                status: false,
                message: "Unauthorized user"
            })
        }

        if (!userData.isVerified) {
            let otp = Math.floor(1000 + Math.random() * 9000);

            let becryptOtp = await becrypt.becryptData(otp);
            const resData = await userModel.update({
                verifiedOtp: becryptOtp,
                otpExpire: Date.now(),
            }, {
                where: { id: userData.id }
            })


            if (!resData) {
                throw new Error("data not stored");
            }
            else {

                let template = await emailTemplate(otp);
                let emailData = {
                    template: template,
                    email: email,
                    subject: "Kukko Registration Otp"
                }

                let sendEmail = await emailService.sendEmail(emailData, res);
                let statuCode = sendEmail.status ? 200 : 500;
                return res.status(statuCode).json({
                    status: sendEmail.status,
                    message: sendEmail.message,
                    id: userData.id
                })
            }

        }

        var token = await webToken(userData.id);
        return res.status(200).json({
            status: false,
            message: "successfully login",
            token: token
        })

    }
    catch (error) {
        var err = new Error(error);
        err.statusCode = error.statusCode;
        throw err;
    }
})




