import mongoose from "mongoose";
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_USER,
  DB_REPLICA_SET,
  DB_PROTOCOL,
} from "./constants";

export const uri = `${DB_PROTOCOL}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}`;

mongoose.set("strictQuery", true);

let mongo = mongoose.connect(uri, {
  dbName: DB_DATABASE,
  replicaSet: DB_REPLICA_SET,
});

mongo
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.error(err);
  });
