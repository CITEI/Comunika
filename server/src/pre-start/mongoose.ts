import mongoose from "mongoose";

export const config = {
  HOST: process.env.DB_HOST,
  PORT: process.env.DB_PORT,
  DATABASE: process.env.DB_NAME,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
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
