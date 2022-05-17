import jwt from "jsonwebtoken";
import { UserInput, UserDocument } from "../model/game/user";
import {
  JWT_ALGORITHM,
  JWT_EXPIRATION,
  JWT_SECRET,
} from "../pre-start/constants";
import { DuplicatedError } from "./errors";
import { userService } from "./user";
import Service from "./utils/service";

export default class AuthenticationService extends Service {
  /**
   * Registers a new user into the db
   */
  async registerUser(payload: UserInput): Promise<UserDocument> {
    if (!(await userService.exists({ email: payload.email })))
      return await userService.create(payload);
    else throw new DuplicatedError("User", "email");
  }

  /**
   * Creates a jwt token for an user
   */
  async loginUser(payload: { id: string; email: string }): Promise<string> {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
      algorithm: JWT_ALGORITHM,
    });
    return `Bearer ${token}`;
  }
}

export const authenticationService = new AuthenticationService();
