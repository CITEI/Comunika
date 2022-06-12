import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {
  JWT_ALGORITHM,
  JWT_EXPIRATION,
  JWT_SECRET,
} from "../../pre-start/constants";
import { DuplicatedError, UserNotFoundError, WrongPasswordError } from "../errors";
import { BasicService } from "./basic";
import Service from "./service";

interface BaseUserInput {
  email: string;
  password: string;
  [key: string]: any;
}

interface BaseUser extends BaseUserInput, mongoose.Document {
  passwordMatches: (pass: string) => Promise<boolean>;
}

export enum AuthenticationResponses {
  LOGGED,
  WRONG_PASSWORD,
  NOT_FOUND,
}

export class AuthenticationService<
  D extends I & BaseUser,
  I extends BaseUserInput
> extends Service {
  protected service: BasicService<D, I>;

  constructor({ service }: { service: BasicService<D, I> }) {
    super();
    this.service = service;
  }

  /**
   * Registers a new user into the db
   */
  async registerUser(payload: I): Promise<D> {
    if (!(await this.service.exists({ email: payload.email })))
      return await this.service.create(payload);
    else throw new DuplicatedError("User", "email");
  }

  /**
   * Creates a jwt token for an user
   */
  async generateJwt(payload: { id: string; email: string }): Promise<string> {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
      algorithm: JWT_ALGORITHM,
    });
    return `Bearer ${token}`;
  }

  /**
   * Checks if an email and password match
   */
  async login(payload: {
    email: string;
    password: string;
  }): Promise<D> {
    const user = await this.service.find({ by: { email: payload.email } });
    if (await user.passwordMatches(payload.password))
      return user;
    else
      throw new WrongPasswordError()
  }
}
