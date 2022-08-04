import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Router } from "express";
import "express-async-errors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import custom_errors from "./middleware/errors";
import { BASE_PATH, PUBLIC_PATH, STATIC_DIR } from "./pre-start/constants";
import passport from "./pre-start/passport";
import swaggerDocs from "./pre-start/swagger";
import authRouter from "./route/game/authentication";
import moduleRouter from "./route/game/module";
import stageRouter from "./route/game/stage";
import userRouter from "./route/game/user";
import winston from "./pre-start/winston";
import adminjs from "./pre-start/adminjs";

// Constants
const app = express();

/***********************************************************************************
 *                                  Admin Panel
 **********************************************************************************/

app.use(`${BASE_PATH}/admin`, adminjs({ route: `${BASE_PATH}/admin` }));

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
const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/module", moduleRouter);
apiRouter.use("/stage", stageRouter);
apiRouter.use("/user", userRouter);
apiRouter.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(BASE_PATH, apiRouter);

// Errors
app.use(custom_errors()); // app-only errors

/***********************************************************************************
 *                                  Front-end content
 **********************************************************************************/

// Set static dir
app.use(`/${STATIC_DIR}`, express.static(PUBLIC_PATH));

// Export here and start in a diff file (for testing).
export default app;
