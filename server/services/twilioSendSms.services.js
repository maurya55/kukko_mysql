const twilio = require('twilio');


exports.sendTextSms = async (phone, message) => {
    console.log(process.env.TWILIO_SID,process.env.TWILIO_TOKEN);
    try {
        const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
        await client.messages
            .create({
                body: message,
                from: process.env.TWILIO_MOBILE,
                to: phone,
            })
            .then((message) => {
                console.log(message);
                console.log(message.sid);
            });

    }
    catch (error) {
        var err = new Error(error);
        throw err;
    }

}