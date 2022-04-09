import passport from "passport";
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptions as JwtOptions,
} from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { IUserDocument, User } from "../model/user/user";
import {
  BadRequestError,
  InvalidCredentials,
  UserNotFoundError,
} from "../service/errors";
import { JWT_ALGORITHM, JWT_SECRET } from "./constants";

const opts: JwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
  algorithms: [JWT_ALGORITHM],
};

passport.use(
  new JwtStrategy(opts, (payload, done) => {
    User.findById(payload.sub, (err: Error, user: IUserDocument) => {
      if (err) return done(new BadRequestError(), false);
      if (!user) return done(new InvalidCredentials(), false);
      else return done(null, user);
    });
  })
);

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    (email: string, password: string, done: Function) => {
      User.findOne({ email }, async (err: Error, user: IUserDocument) => {
        if (err) return done(new BadRequestError(), false);
        if (!user) return done(new UserNotFoundError(), false);
        if (!(await user.passwordMatches(password)))
          return done(new InvalidCredentials(), false);
        else return done(null, user);
      });
    }
  )
);

export default passport;
