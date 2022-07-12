const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express"); 
const swaggerJson=require("./swagger.json");
module.exports = (app) => {


    const options = {
        definition: {
          openapi: "3.0.0",
          info: {
            title: "Node js project kukko",
            version: "0.1.0",
            description:
              "This is kukko documentaion Express and documented with Swagger",
          },
          servers: [
            {
              url: "http://localhost:4400/",
            },
          ],
        },
        apis: ["../server/routes/v1/*.js"],
      };
      
    //   const swaggerSpecs = swaggerJsdoc(options);
      app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerJson)
      );
}
