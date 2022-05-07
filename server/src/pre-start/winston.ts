import moment from "moment";
import path from "path";
import winston from "winston";
import { LOG_FOLDER } from "./constants";


const date = moment().format('YYYY-MM-DD');

export default winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.colorize(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(LOG_FOLDER, "error", `error-${date}.log`),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(LOG_FOLDER, "info", `info-${date}.log`),
      level: "info",
    }),
  ],
});
