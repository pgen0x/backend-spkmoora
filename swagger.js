const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });
const outputFile = "./swagger_output.json";
const endpointsFiles = ["./app.js"];
const dotenv = require("dotenv");
dotenv.config();

let host =
  process.env.NODE_ENV === "production" ? "apibi.codermatter.com" : "localhost";

const doc = {
  info: {
    version: "1.0.0",
    title: "SPK MOORA API",
    description: "SPK MOORA API Documentation.",
  },
  host: process.env.NODE_ENV === "production" ? host : `${host}:3001`,
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

//swaggerAutogen(outputFile, endpointsFiles);
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./server.js");
});
