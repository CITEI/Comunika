import { Router, Request, Response } from 'express';
import { userService } from "../../service/user";
import { ORIGIN, BASE_PATH } from '../../pre-start/constants';
import { accountTokenService } from '../../service/accountToken';
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { sendDeleteAccount } from '../../service/email';
import fs from 'fs/promises';
import path from 'path';
import { celebrate } from 'celebrate';
import Joi from 'joi';
const router = Router();

router.get("/", async (req: Request, res: Response) => {
  let emailHtml = await fs.readFile(path.resolve(__dirname, "../../html/deleteAccount.html"), 'utf8');
  const url = ORIGIN + BASE_PATH + '/delete-account/send';

  return res.status(StatusCodes.OK).send(emailHtml.replace('&url', url));
});

router.post("/send", async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!(await userService.exists({ email: email }))) {
    let emailHtml = await fs.readFile(path.resolve(__dirname, "../../html/emailFailed.html"), 'utf8');
    const url = ORIGIN + BASE_PATH + '/delete-account/send';
  
    return res.status(StatusCodes.UNAUTHORIZED).send(emailHtml.replace('&url', url));
  }

  if (await accountTokenService.exists({ email: email })) {
    res.status(200);
    return res.sendFile(path.join(__dirname, "../../html/emailSent.html"));
  }

  const token = await accountTokenService.generateToken(12);
  await accountTokenService.create({ email: email, token: token });

  return await sendDeleteAccount(email, res, email, token);
});

router.get("/delete", celebrate({
  query: {
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    token: Joi.string().length(12).required()
  }
}), async (req: Request, res: Response) => {
  const { email, token } = req.query as { email: string, token: string };

  if (!(await accountTokenService.validate(email, token))) {
    res.status(StatusCodes.UNAUTHORIZED);
    return res.send(ReasonPhrases.UNAUTHORIZED);
  }

  await accountTokenService.delete({ email });
  await userService.delete({ email });

  res.status(200).sendFile(path.join(__dirname, "../../html/accountDeleted.html"));
});

export default router;