import swaggerJSDoc, { Options } from "swagger-jsdoc";
import {ORIGIN, BASE_PATH } from "./constants";

const opts: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Comunizika API",
      version: "1.0.0",
      description: "API for the Comunika App."
    },
    servers: [{url: ORIGIN + BASE_PATH}]
  },
  apis: ['src/swagger/*.yaml'],
};

export default swaggerJSDoc(opts);
