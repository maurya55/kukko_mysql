const Sequelize = require("sequelize");
const sequelize=require("../config/config");



// sequelize.sync();
// sequelize.sync({alter:true});


var db={
    Sequelize,
    sequelize,
}

db.User=require("./userModel")(sequelize,Sequelize);

module.exports=db;