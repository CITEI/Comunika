import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import cors from "cors";

import express, { Router } from "express";
import "express-async-errors";

import authRouter from "./route/authentication";
import custom_errors from "./middleware/errors";
import * as celebrate from "celebrate";
import passport from "./pre-start/passport";
import { API_VERSION } from "./pre-start/constants";

// Constants
const app = express();

/***********************************************************************************
 *                                  Middlewares
 **********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(passport.initialize());

/***********************************************************************************
 *                                Debugging outputs
 **********************************************************************************/

// Show routes called in console during development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Security (helmet recommended in express docs)
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
}

/***********************************************************************************
 *                         API routes and error handling
 **********************************************************************************/

// Adds api router
const apiRouter = Router()

apiRouter.use('/auth', authRouter)

app.use(`/api/${API_VERSION}`, apiRouter);

// Errors
app.use(celebrate.errors()); // validation errors
app.use(custom_errors()); // app-only errors

/***********************************************************************************
 *                                  Front-end content
 **********************************************************************************/

// Set static dir
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

// Export here and start in a diff file (for testing).
export default app;
