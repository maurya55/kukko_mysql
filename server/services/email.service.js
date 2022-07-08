const nodemailer = require('nodemailer');
require('dotenv').config();

exports.sendEmail = async (data, res) => {



    try {
        var transporter = nodemailer.createTransport({
            // service: 'gmail',
            host: "smtp.gmail.com",
            port: 465,
            auth: {
                user: process.env.SENT_EMAIL,
                // pass: "mzryhylacowabbfu",
                pass: process.env.SENT_PASS
            }
        });

        var mailOptions = {
            from: process.env.SENT_EMAIL,
            to: data.email,
            subject: 'Sending Email using Node.js',
            html: data.template
        };




        let checkData = await transporter.sendMail(mailOptions);

        if(checkData.response)
        {
            return ({
                status: true,
                data:checkData,
                message:`otp is sent to ${data.email} `
            })
        }
        else{
            return ({
                status: false,
                message:"Failed to send verification Email",
            })
        }
       

    //     transporter.sendMail(mailOptions, function (error, info) {
    //         if (error) {
    //             // return res.status(500).json({
    //             //     status: false,
    //             //     message:process.env.NODE_ENV=="developmet" ? error : "failed to send verification email"
    //             // })
    //         } else {
    //             // return res.status(200).json({
    //             //     status: true,
    //             //     message:`otp is sent to your ${data.email} `
    //             // })
    //         }
    //     });

    }
    catch (error) {
        
        return res.status(500).json({
            status: false,
            message: process.env.NODE_ENV == "developmet" ? error.stack : "failed to send verification email"
        })
    }



}