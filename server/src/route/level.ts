import {
  createLevel,
  deleteLevel,
  findLevels,
  findNext,
  swapLevels,
} from "../service/level";
import { celebrate, Joi } from "celebrate";
import { Router, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json(await findLevels());
});

router.post(
  "/",
  celebrate({
    body: {
      name: Joi.string().required(),
    },
  }),
  async (req: Request, res: Response) => {
    await createLevel({ name: req.body.name });
    res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
  }
);

router.get(
  "/:id/next",
  celebrate({
    params: {
      id: Joi.string().required(),
    },
  }),
  async (req: Request, res: Response) => {
    const next = await findNext({ id: req.params.id });
    if (next) res.status(StatusCodes.OK).json(next);
    else res.status(StatusCodes.NO_CONTENT).send(ReasonPhrases.NO_CONTENT);
  }
);

router.delete(
  "/:id",
  celebrate({
    params: {
      id: Joi.string().required(),
    },
  }),
  async (req: Request, res: Response) => {
    await deleteLevel({ id: req.params.id });
    res.status(StatusCodes.OK).send(ReasonPhrases.OK);
  }
);

router.put(
  "/swap",
  celebrate({
    body: {
      from: Joi.string().required(),
      to: Joi.string().required(),
    },
  }),
  async (req: Request, res: Response) => {
    await swapLevels({ from: req.body.from, to: req.body.to });
    res.status(StatusCodes.OK).send(ReasonPhrases.OK);
  }
);

export default router;
