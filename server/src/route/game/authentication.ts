import { disabilityService } from "../../service/disability";
import { celebrate, Joi } from "celebrate";
import { Request, Response, Router } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import passport from "passport";
import { UserInput, UserDocument } from "../../model/user";
import { userAuthenticationService } from "../../service/user";
import { CustomJoi } from "../utils/custom_joi";

const router = Router();

router.post(
  "/register",
  celebrate({
    body: {
      email: CustomJoi.RequiredString(),
      password: CustomJoi.RequiredString(),
      guardian: CustomJoi.RequiredString(),
      relationship: CustomJoi.RequiredString(),
      birth: Joi.date().required(),
      region: CustomJoi.RequiredString(),
      disabilities: Joi.array().items(CustomJoi.ObjectId()).required().min(1),
    },
  }),
  async (req: Request, res: Response) => {
    await userAuthenticationService.registerUser(req.body as UserInput);
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
    const token = await userAuthenticationService.generateJwt({
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
    const token = await userAuthenticationService.generateJwt({
      id: user._id,
      email: user.email,
    });
    res.status(StatusCodes.OK).send(token);
  }
);

router.get('/disabilities', async (req, res) => {
  const disabilities = await disabilityService.findAll()
  res.status(StatusCodes.OK).send(disabilities)
})

export default router;
