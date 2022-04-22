import mongoose from "mongoose";
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
  DB_REPLICA_SET,
} from "./constants";

export const uri = `mongodb://${DB_HOST}:${DB_PORT}`;

mongoose
  .connect(uri, {
    dbName: DB_DATABASE,
    user: DB_USER,
    pass: DB_PASSWORD,
    replicaSet: DB_REPLICA_SET,
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.error(err);
  });
