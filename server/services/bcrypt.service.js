const bcrypt = require('bcrypt');


exports.becryptData=async (data)=>{
    var data=data.toString();
    let encryptData=await bcrypt.hash(data,10);
    return encryptData;

}


exports.becryptCompare=async (plainText,hash)=>{
var plainPassword=plainText.toString();
  var data= await bcrypt.compare(plainPassword,hash );

  return data;
}