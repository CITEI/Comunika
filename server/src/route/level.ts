import { levelService } from "../service/level";
import { celebrate, Joi } from "celebrate";
import { Router, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { levelCategoryRouter } from "./category";
import { CustomJoi } from "./utils/custom_joi";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json(await levelService.findAll());
});

router.post(
  "/",
  celebrate({
    body: {
      name: Joi.string().required(),
    },
  }),
  async (req: Request, res: Response) => {
    await levelService.create({ name: req.body.name });
    res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
  }
);

router.get(
  "/:id/next",
  celebrate({
    params: {
      id: CustomJoi.ObjectId().required(),
    },
  }),
  async (req: Request, res: Response) => {
    const next = await levelService.findNext({ id: req.params.id });
    if (next) res.status(StatusCodes.OK).json(next);
    else res.status(StatusCodes.NO_CONTENT).send(ReasonPhrases.NO_CONTENT);
  }
);

router.delete(
  "/:id",
  celebrate({
    params: {
      id: CustomJoi.ObjectId().required(),
    },
  }),
  async (req: Request, res: Response) => {
    await levelService.delete({ id: req.params.id });
    res.status(StatusCodes.OK).send(ReasonPhrases.OK);
  }
);

router.put(
  "/swap",
  celebrate({
    body: {
      from: CustomJoi.ObjectId().required(),
      to: CustomJoi.ObjectId().required(),
    },
  }),
  async (req: Request, res: Response) => {
    await levelService.swap({ from: req.body.from, to: req.body.to });
    res.status(StatusCodes.OK).send(ReasonPhrases.OK);
  }
);

router.use(
  "/:level/category",
  celebrate({ params: { level: CustomJoi.ObjectId().required() } }),
  levelCategoryRouter
);

export default router;
