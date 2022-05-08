import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Router } from "express";
import "express-async-errors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import swaggerUi from "swagger-ui-express";
import custom_errors from "./middleware/errors";
import { BASE_PATH } from "./pre-start/constants";
import passport from "./pre-start/passport";
import swaggerDocs from "./pre-start/swagger";
import authRouter from "./route/authentication";
import levelRouter from "./route/level";
import categoryRouter from "./route/category";
import userRouter from "./route/user"
import winston from "./pre-start/winston";


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
const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/level", levelRouter);
apiRouter.use("/category", categoryRouter);
apiRouter.use("/user", userRouter);
apiRouter.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(BASE_PATH, apiRouter);

// Errors
app.use(custom_errors()); // app-only errors

/***********************************************************************************
 *                                  Front-end content
 **********************************************************************************/

// Set static dir
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

// Export here and start in a diff file (for testing).
export default app;
