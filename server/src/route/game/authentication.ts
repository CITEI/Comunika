import { celebrate, Joi } from "celebrate";
import { Request, Response, Router } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import passport from "passport";
import { UserInput, UserDocument } from "../../model/game/user";
import { authenticationService } from "../../service/authentication";

const router = Router();

router.post(
  "/register",
  celebrate({
    body: {
      email: Joi.string().required(),
      password: Joi.string().required(),
      name: Joi.string().required(),
    },
  }),
  async (req: Request, res: Response) => {
    await authenticationService.registerUser(req.body as UserInput);
    res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
  }
);

router.post(
  "/",
  celebrate({
    body: {
      email: Joi.string().required(),
      password: Joi.string().required(),
    },
  }),
  passport.authenticate("local", { session: false }),
  async (req: Request, res: Response) => {
    const user = req.user as UserDocument;
    const token = await authenticationService.loginUser({
      id: user._id,
      email: user.email,
    });
    res.status(StatusCodes.OK).send(token);
  }
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req: Request, res: Response) => {
    const user = req.user as UserDocument;
    const token = await authenticationService.loginUser({
      id: user._id,
      email: user.email,
    });
    res.status(StatusCodes.OK).send(token);
  }
);

export default router;
