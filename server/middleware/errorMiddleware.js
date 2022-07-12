exports.errorHandling=(err,req,res,next)=>{

    let statusCode=res.statusCod || 500 ;
    res.status(statusCode).json({
       error:err.message.split("Error: ")[1],
        stack: process.env.NODE_ENV=="development" ? err.stack : null
    })
  }

exports.notFound=(req,res)=>{
    res.status(200)
    throw new Error('api not found '+ `${req.originalUrl}`);
}