import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { ServerError } from "@service/errors";

/**
 * Answers a request that resulted in an error
 */
function sendError(code: number, err: Error, res: Response) {
  res.status(code).json({ type: err.name, message: err.message });
}

/** Process app scope errors and other non caught errors */
function middleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ServerError)
    sendError(err.statusCode, err, res)
  else
    sendError(StatusCodes.INTERNAL_SERVER_ERROR, err, res);
}

export default () => middleware
