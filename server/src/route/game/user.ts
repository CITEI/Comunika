import { EvaluationStatus, userService } from "../../service/user";
import { celebrate, Joi } from "celebrate";
import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { InternalServerError } from "../../service/errors";
import passport from "passport";
import { UserDocument } from "src/model/user";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.get(
  "/box",
  celebrate({
    body: {
      module: Joi.string().required()
    }
  }),
  async (req: Request, res: Response) => {
    const id = (req.user as UserDocument)._id;
    const box = await userService.findBox({ "id": id, "module": req.body.module });
    res.status(StatusCodes.OK).send(box);
  }
);

router.post(
  "/box",
  celebrate({
    body: {
      answers: Joi.array().items(Joi.array().items(Joi.boolean())).required(),
    },
  }),
  async (req: Request, res: Response) => {
    const id = (req.user as UserDocument)._id;
    switch (+(await userService.evaluate({ id, ...req.body }))) {
      case EvaluationStatus.Approved:
        res.status(StatusCodes.OK).send({ status: "approved" });
        break;
      case EvaluationStatus.Reproved:
        res.status(StatusCodes.OK).send({ status: "reproved" });
        break;
      default:
        throw new InternalServerError();
    }
  }
);

router.get(
  "/history",
  async (req: Request, res: Response) => {
    const id = (req.user as UserDocument)._id;
    const history = await userService.findHistory({ id });
    res.status(StatusCodes.OK).send(history);
  }
);

router.get(
  "/",
  async (req: Request, res: Response) => {
    const id = (req.user as UserDocument)._id;
    res
      .status(StatusCodes.OK)
      .send(await userService.findUserData({ id }));
  }
);

export default router;
