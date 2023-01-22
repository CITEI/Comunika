import { disabilityService } from "../../service/disability";
import { celebrate, Joi } from "celebrate";
import { Request, Response, Router } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import passport from "passport";
import { UserInput, UserDocument } from "../../model/user";
import { userAuthenticationService, userService } from "../../service/user";
import { CustomJoi } from "../utils/custom_joi";
import resetMessageSend from "../../service/email";
import { codeService } from "../../service/code";
import { content } from "../../html/index";

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

router.get("/disabilities", async (req, res) => {
  const disabilities = await disabilityService.findAll();
  res.status(StatusCodes.OK).send(disabilities);
});

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

router.get(
  "/passreset/validatecode",
  celebrate({
    body: {
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
      code: Joi.string().max(6).required(),
    },
  }),
  async (req, res) => {
    const { email, code } = req.body;

    console.log(code);

    if (await codeService.validate({ email, code }))
      return res.status(StatusCodes.OK).send(ReasonPhrases.OK);

    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send(ReasonPhrases.UNAUTHORIZED);
  }
);

router.put(
  "/passreset",
  celebrate({
    body: {
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
      code: Joi.string().max(6).required(),
      password: CustomJoi.RequiredString(),
    },
  }),
  async (req, res) => {
    const { email, code, password } = req.body;
    console.log({ email, code, password });

    if (!(await userService.exists({ email: email })))
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send(ReasonPhrases.UNAUTHORIZED);

    console.log(1);

    if (!(await codeService.validate({ email, code })))
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send(ReasonPhrases.UNAUTHORIZED);

    await codeService.delete({ email });

    await userService.findAndResetPass({ password, email });

    return res.status(StatusCodes.ACCEPTED).send(ReasonPhrases.ACCEPTED);
  }
);

export default router;
