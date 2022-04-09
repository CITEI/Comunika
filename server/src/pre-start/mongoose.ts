import mongoose from "mongoose";
import {
  DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER
} from "./constants";

export const config = {
  HOST: DB_HOST,
  PORT: DB_PORT,
  DATABASE: DB_DATABASE,
  USER: DB_USER,
  PASSWORD: DB_PASSWORD,
};

export const uri = `mongodb://${config.HOST}:${config.PORT}`;

mongoose
  .connect(uri, {
    dbName: config.DATABASE,
    user: config.USER,
    pass: config.PASSWORD,
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.error(err);
  });
