import swaggerJSDoc, { Options } from "swagger-jsdoc";
import { BASE_PATH } from "./constants";

const opts: Options = {
  swaggerDefinition: {
    info: {
      title: "EducaZikaAPI",
      version: "0.0.1",
    },
    basePath: BASE_PATH,
  },
  apis: ['src/route/*.ts'],
};

export default swaggerJSDoc(opts);
