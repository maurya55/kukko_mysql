const becrypt = require("../services/bcrypt.service");

module.exports = (sequelize, type) => {

    var user = sequelize.define('user', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:
        {
            type: type.STRING,
            allowNull: false,
        },
        email: {
            type: type.STRING,
            allowNull: false,
            after: "name"
        },
        password: {
            type: type.STRING,
            allowNull: false,
            after: "email"
        },
        mobile: {
            type: type.BIGINT,
            defaultValue: null,
            after: "password"
        },
         verifiedOtp: {
            type: type.STRING,
            defaultValue: null,
            after: "age"
        },
        otpExpire: {
            type: type.BIGINT,
            defaultValue: null,
            after: "verifiedOtp"
        },
        isVerified: {
            type: type.BOOLEAN,
            defaultValue: false,
            after: "otpExpire"
        },


    }, {
        paranoid: true,
        hooks: {
            beforeCreate:async (user)=> {
                let returnData = await becrypt.becryptData(user.password);
                user.password = returnData;
            }
        }
    }
    )

    //   user.beforeCreate(async (user, options) => {
    //     let returnData = await becrypt.becryptData(user.password);
    //     user.password = returnData;
    //   });

    return user;
}