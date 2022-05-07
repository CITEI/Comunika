import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

/**
 * Error containing HttpCode response
 */
export class ServerError extends Error {
  statusCode: number;
  extra?: object;

  constructor(params: {
    name: string;
    statusCode: number;
    message: string;
    extra?: object;
  }) {
    super(params.message);
    this.name = params.name;
    this.statusCode = params.statusCode;
    this.extra = params.extra;
  }

  get body(): { [key: string]: any } {
    let body: { [key: string]: any } = {
      name: this.name,
      message: this.message,
    };

    if (this.extra != undefined) body["extra"] = this.extra;

    return body;
  }
}

/**
 * Thrown when a resource is already registered
 */
export class DuplicatedError extends ServerError {
  constructor(schema: string, field: string) {
    super({
      name: "Conflict",
      statusCode: StatusCodes.CONFLICT,
      message: `${schema} ${field} already registered`,
    });
  }
}

/**
 * Thrown when a resource is not found
 */
export class NotFoundError extends ServerError {
  constructor({ message }: { message: string }) {
    super({
      name: "NotFound",
      message: message,
      statusCode: StatusCodes.NOT_FOUND,
    });
  }
}

export class ObjectNotFoundError extends NotFoundError {
  constructor({ schema }: { schema: string | mongoose.Model<any> }) {
    if (!(schema instanceof String))
      schema = (schema as mongoose.Model<any>).collection.collectionName

    super({
      message: `${schema} not found`,
    });
  }
}

export class AttributeNotFoundError extends NotFoundError {
  constructor({ schema, field }: { schema: string; field: string }) {
    super({
      message: `No matching ${field} in ${schema}`,
    });
  }
}

/**
 * Thrown when an user is not found
 */
export class UserNotFoundError extends AttributeNotFoundError {
  constructor() {
    super({ schema: "User", field: "email" });
  }
}

interface InvalidField {
  name: string;
  problem: "missing" | "extra" | "invalid";
}

/**
 * Thrown when a request is malformed
 */
export class BadRequestError extends ServerError {
  constructor(params?: { fields?: Array<InvalidField> }) {
    super({
      name: "BadRequest",
      message: "Request malformed",
      statusCode: StatusCodes.BAD_REQUEST,
      extra: params?.fields,
    });
  }
}

export class ValidationError extends ServerError {
  constructor({ fields }: { fields: Array<InvalidField> }) {
    super({
      name: "InvalidRequest",
      message: "Invalid fields are present",
      statusCode: StatusCodes.BAD_REQUEST,
      extra: fields,
    });
  }
}

/**
 * Thrown when an user cannot access some route
 */
export class UnauthorizedError extends ServerError {
  constructor() {
    super({
      name: "Unauthorized",
      message: "User doesn't have privileges to continue",
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  }
}

/**
 * Thrown when an user send invalid credentials
 */
export class InvalidCredentials extends ServerError {
  constructor() {
    super({
      name: "InvalidCredentials",
      message: "The credentials you've provided are not correct or expired",
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  }
}

/**
 * Thrown when there's no such handler for an error
 */
export class InternalServerError extends ServerError {
  constructor() {
    super({
      name: "InternalServerError",
      message: "The server had trouble processing this request",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
