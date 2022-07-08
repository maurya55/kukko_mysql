var jwt = require('jsonwebtoken');

exports.webToken = async (data) => {

    var token = await jwt.sign({
        id: data,
        date: Date.now()
    }, process.env.SECRET_KEY, { expiresIn: process.env.EXPIRY_TIME });


    return token

}