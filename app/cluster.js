

const cluster = require('cluster');
const os=require('os');
const PORT=process.env.PORT || 4400 ;

exports.cluster=async (app)=>{
const numCPUs = os.cpus().length;
// console.log(os.cpus());
// console.log(numCPUs);
if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
   
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
   
    // This event is firs when worker died
    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });
  }
  else{

    app.listen(PORT,()=>{
        console.log(`App is listen http://localhost:${PORT}`);
    })

  }
  
}