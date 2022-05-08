import moment from "moment";
import path from "path";
import winston from "winston";
import { LOG_FOLDER } from "./constants";

const date = moment().format("YYYY-MM-DD");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.prettyPrint()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(LOG_FOLDER, "error", `error-${date}.log`),
      level: "error",
      format: winston.format.json(),
    }),
    new winston.transports.File({
      filename: path.join(LOG_FOLDER, "info", `info-${date}.log`),
      level: "info",
      format: winston.format.json(),
    }),
  ],
});

if (process.env.NODE_ENV == "development") {
  logger.add(
    new winston.transports.Console({
      level: "info",
    })
  );
}

export default logger;
