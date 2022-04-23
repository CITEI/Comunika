import jwt from "jsonwebtoken";
import { IUser, IUserDocument, User } from "../model/user/user";
import {
    JWT_ALGORITHM,
    JWT_EXPIRATION, JWT_SECRET
} from "../pre-start/constants";
import { DuplicatedError } from "./errors";
import Service from "./utils/service";

export default class AuthenticationService extends Service {
  /**
   * Registers a new user into the db
   */
  async registerUser(params: IUser): Promise<IUserDocument> {
    if ((await User.findOne({ email: params.email })) == null)
      return User.create(params);
    else throw new DuplicatedError("User", "email");
  }

  /**
   * Creates a jwt token for an user
   */
  async loginUser(payload: {
    id: string;
    email: string;
  }): Promise<string> {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
      algorithm: JWT_ALGORITHM,
    });
    return `Bearer ${token}`;
  }
}

export const authenticationService = new AuthenticationService();
