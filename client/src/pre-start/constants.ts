import env from "@env"; // eslint-disable-line

export const ENV = process.env.ENV || "development";
export const API_VERSION = process.env.API_VERSION || "v1";
export const API_DOMAIN = process.env.API_DOMAIN || "http://localhost:3000";
export const API_BASE_URL = `${API_DOMAIN}/api/${API_VERSION}`;
export const APP_NAME = "EducaZika";
