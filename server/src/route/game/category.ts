import { categoryService } from "../../service/category";
import { celebrate, Joi } from "celebrate";
import { Request, Response, Router } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { categoryTaskRouter } from "./task";
import { CustomJoi } from "../utils/custom_joi";

/**
 * Category only routes
 */
const router = Router();

router.get(
  "/:id/next",
  celebrate({
    params: {
      id: CustomJoi.ObjectId().required(),
    },
  }),
  async (req: Request, res: Response) => {
    const next = await categoryService.findNext({ id: req.params.id });
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
    await categoryService.delete({ id: req.params.id });
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
    await categoryService.swap({ from: req.body.from, to: req.body.to });
    res.status(StatusCodes.OK).send(ReasonPhrases.OK);
  }
);

router.use(
  "/:category/task",
  celebrate({ params: { category: CustomJoi.ObjectId().required() } }),
  categoryTaskRouter
);

export default router;

/**
 * Required level id routes
 */
export const levelCategoryRouter = Router({ mergeParams: true });

levelCategoryRouter.post(
  "/",
  celebrate({
    body: {
      name: Joi.string().required(),
      description: Joi.string().required(),
      iconUrl: Joi.string().required(),
    },
  }),
  async (req: Request, res: Response) => {
    await categoryService.create({ ...req.body, ...req.params });
    res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
  }
);

levelCategoryRouter.get("/", async (req: Request, res: Response) => {
  res
    .status(StatusCodes.OK)
    .send(await categoryService.findAll(req.params as any));
});
