import { NextFunction, Request, Response } from "express";
import { BadRequestError, InternalServerError, ServerError, ValidationError } from "../service/errors";
import mongoose from "mongoose";
import { CelebrateError } from "celebrate";


/**
 * Standardizes frameworks errors and libraries errors
 */
function parseError(err: Error): ServerError
{
  if (err instanceof ServerError)
    return err

  if (err instanceof mongoose.Error.CastError)
    return new ValidationError({
      fields: [{name: err.path, problem: "invalid"}]
    })

  else if (err instanceof mongoose.Error.ValidatorError)
    return new ValidationError({
      fields: [{name: err.properties.path!, problem: "invalid"}]
    })

  else if (err instanceof mongoose.Error.ValidationError)
    return parseError(err.errors[Object.keys(err.errors)[0]])

  else if (err instanceof CelebrateError)
  {
    const detail = err.details.get('body')!.details[0]
    const name = detail.path[0].toString()
    const problem = detail.type == 'object.unknown' ? "extra" : "missing"
    return new BadRequestError({fields: [{name, problem}]})
  }

  return new InternalServerError();
}

/**
 * Answers a request that resulted in an error
 */
function sendError(err: ServerError, res: Response) {
  res.status(err.statusCode).json(err.body);
}

/**
 * Processes app scope errors and other non caught errors
 */
function middleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);
  sendError(parseError(err), res)
}

export default () => middleware
