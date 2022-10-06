
const event=require("events");
const db = require("../model/configModel");
const userModel = db.User;
const em=new event.EventEmitter();
const asyncHandler = require('express-async-handler')
const excel = require("exceljs");
let workbook = new excel.Workbook();
let worksheet = workbook.addWorksheet("testing");

exports.eventEmitter=async (req,res)=>{

    em.addListener('FirstEvent', function (data) {
        console.log('First subscriber: ' + data);
    });
    
    em.on("callFirstEmitter",(data)=>{
        console.log(data);
        return data;
    })

   var data= await  em.emit("callFirstEmitter","Testing data");
   console.log("return data "+data);
    em.emit("FirstEvent","addListener")

   return res.send("Event Emitter");

}

exports.importExcel=asyncHandler(async (req,res)=>{


    worksheet.columns = [
        { header: "S no.", key: "s_no", width: 10 },
        { header: "Id", key: "id", width: 5 },
        { header: "Name", key: "name", width: 25 },
        { header: "Email", key: "email", width: 25 },
        { header: "Mobile", key: "mobile", width: 15 },
      ];
      let checkUser = await userModel.findAll({
    })

    let counter = 1;
    checkUser.forEach((user) => {
        user.s_no = counter;
        worksheet.addRow(user); // Add data in worksheet
        counter++;
      })
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
      });

    //   worksheet.addRows(checkUser);
    //   worksheet.addRow({id: 1, title: 'wap',description:"first description", published: new Date(1970,1,1)});
    //     worksheet.addRow({id: 2, title: 'Jane Doe', description:"second description", published: new Date(1965,1,7)});
// res is a Stream object
res.setHeader(
  "Content-Type",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
);
res.setHeader(
  "Content-Disposition",
  "attachment; filename=" + "testing.xlsx"
);
return workbook.xlsx.write(res).then(function () {
  res.status(200).end();
});
    
}) 