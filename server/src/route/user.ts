import { EvaluationStatus, userService } from "../service/user";
import { celebrate, Joi } from "celebrate";
import { Router, Request, Response } from "express";
import { CustomJoi } from "./utils/custom_joi";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { InternalServerError } from "../service/errors";

const router = Router();

router.get(
  "/:id/box",
  celebrate({
    params: {
      id: CustomJoi.ObjectId().required(),
    },
  }),
  async (req: Request, res: Response) => {
    const box = await userService.findBox(req.params as any);
    res.status(StatusCodes.OK).send(box);
  }
);

router.post(
  "/:id/box",
  celebrate({
    params: {
      id: CustomJoi.ObjectId().required(),
    },
    body: {
      answers: Joi.array().items(Joi.number().required().min(0)).required(),
    },
  }),
  async (req: Request, res: Response) => {
    switch (+(await userService.evaluate({ ...req.params, ...req.body }))) {
      case EvaluationStatus.Approved:
        res.status(StatusCodes.OK).send({ status: "approved" });
        break;
      case EvaluationStatus.Reproved:
        res.status(StatusCodes.OK).send({ status: "reproved" });
        break;
      case EvaluationStatus.NoContent:
        res.status(StatusCodes.NO_CONTENT).send(ReasonPhrases.NO_CONTENT);
        break;
      default:
        throw new InternalServerError();
    }
  }
);

router.get(
  "/:id/history",
  celebrate({
    params: {
      id: CustomJoi.ObjectId().required(),
    },
  }),
  async (req: Request, res: Response) => {
    const history = await userService.findHistory({ id: req.params.id });
    res.status(StatusCodes.OK).send(history);
  }
);

router.get(
  "/:id",
  celebrate({ params: { id: CustomJoi.ObjectId().required() } }),
  async (req: Request, res: Response) => {
    res
      .status(StatusCodes.OK)
      .send(await userService.findUserData({ id: req.params.id }));
  }
);

export default router;
