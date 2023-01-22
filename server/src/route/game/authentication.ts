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
      comorbidity: Joi.array().items(CustomJoi.ObjectId()).required().min(1),
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


router.post(
  "/passreset/sendcode",
  celebrate({
    body: {
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
    },
  }),
  async (req, res) => {
    const { email } = req.body;

    if (!(await userService.exists({ email: email })))
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send(ReasonPhrases.UNAUTHORIZED);

    if (await codeService.exists({ email: email }))
      return res.status(StatusCodes.CONTINUE).send(ReasonPhrases.CONTINUE);

    console.log(await codeService.exists({ email: email }));

    const code = String(
      Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
    );

    await codeService.create({ code, email });

    return await resetMessageSend(
      email,
      {
        title: "Comunika",
        html: content({ code }),
      },
      res
    );
  }
);


export default router;
