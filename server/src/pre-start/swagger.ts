import swaggerJSDoc, { Options } from "swagger-jsdoc";
import { BASE_PATH } from "./constants";

const opts: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EducaZikaAPI",
      version: "0.0.1",
      description: "API for the Comunika App."
    },
    servers: [{url: "http://localhost:3000/api/v1"}]
  },
  apis: ['src/swagger/*.yaml'],
};

export default swaggerJSDoc(opts);
