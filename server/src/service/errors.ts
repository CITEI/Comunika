import { StatusCodes } from "http-status-codes";

/**
 * Error containing HttpCode response
 */
export class ServerError extends Error {
  statusCode: number;

  constructor(statusCode: number, msg: string) {
    super(msg);
    this.statusCode = statusCode;
  }
}

/**
 * Thrown when a resource is already registered
 */
export class DuplicatedError extends ServerError {
  constructor(schema: string, field: string) {
    super(StatusCodes.CONFLICT, `${schema} ${field} already registered`);
    this.name = "DuplicatedError";
  }
}

/**
 * Thrown when a resource is not found
 */
export class NotFoundError extends ServerError {
  constructor(schema: string, field: string) {
    super(StatusCodes.NOT_FOUND, `No matching ${field} in ${schema}`);
    this.name = "NotFoundError";
  }
}

/**
 * Thrown when an user is not found
 */
export class UserNotFoundError extends NotFoundError {
  constructor() {
    super('User', 'email')
  }
}

/**
 * Thrown when a request is malformed
 */
export class BadRequestError extends ServerError {
  constructor(interf?: object) {
    if (interf)
      super(StatusCodes.BAD_REQUEST, `Request malformed, required ${interf}`);
    else super(StatusCodes.BAD_REQUEST, "Request malformed");
    this.name = "BadRequest";
  }
}

/**
 * Thrown when an user cannot access some route
 */
export class UnauthorizedError extends ServerError {
  constructor() {
    super(StatusCodes.UNAUTHORIZED, "User doesn't have privileges to continue");
    this.name = "Unauthorized";
  }
}

/**
 * Thrown when an user send invalid credentials
 */
export class InvalidCredentials extends ServerError {
  constructor() {
    super(StatusCodes.UNAUTHORIZED,
          "The credentials you've provided are not correct or expired");
    this.name = "InvalidCredentials";
  }
}
