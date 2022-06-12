export const JWT_EXPIRATION = process.env.JWT_EXPIRATION_TIME || "14d";
export const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const JWT_ALGORITHM = "HS256";
export const API_VERSION = process.env.API_VERSION || "v1";
export const BASE_PATH = `/api/${API_VERSION}`;
export const ENV = process.env.ENV || "development";
export const DB_VERSION = process.env.DB_VERSION || "5.0.0";
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT;
export const DB_DATABASE = process.env.DB_NAME;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_REPLICA_SET = process.env.DB_REPLICASET || "rs0";
export const LOG_FOLDER = "logs";
export const GAME_TASK_SAMPLE_QUANTITY = 10;
export const GAME_MIN_GRADE_PCT = 0.7;
export const APP_NAME = "EducaZika";
export const ADMIN_SECRET = process.env.ADMIN_SECRET || "secret";
export const MIN_PASSWORD_LENGTH = Number(process.env.MIN_PASSWORD_LENGTH || 8)
export const MAX_PASSWORD_LENGTH = Number(
  // arbitrary max to differentiate encrypted from raw
  Math.min(Number(process.env.MAX_PASSWORD_LENGTH || 32), 48)
);
export const MIN_STRING_LENGTH = 3

export const ROOT_NAME = "root";
export const ROOT_EMAIL = "root@root.com";

let temp_root_password = process.env.ROOT_PASSWORD;
if (!temp_root_password)
  if (ENV != "production") temp_root_password = "12345678";
  else throw new Error("Root password must be set for production");

export const ROOT_PASSWORD = temp_root_password;
