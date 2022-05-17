import { categoryService } from "../../service/category";
import { celebrate, Joi } from "celebrate";
import { Router, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { NodeDiscriminators } from "../../model/game/node";
import { CustomJoi } from "../utils/custom_joi";

const router = Router();

export default router;

/**
 * Required category id routes
 */
export const categoryTaskRouter = Router({ mergeParams: true });

categoryTaskRouter.post(
  "/",
  celebrate({
    body: {
      name: Joi.string().required(),
      description: Joi.string().required(),
      nodes: Joi.array()
        .items(
          Joi.object({
            type: Joi.string()
              .valid(...Object.keys(NodeDiscriminators))
              .required(),
            title: Joi.string().required(),
          }).unknown(true)
        )
        .min(1)
        .required(),
      questionNodes: Joi.array()
        .items(
          Joi.object({
            title: Joi.string().required(),
            question: Joi.string().required(),
          }).unknown(true)
        )
        .min(1)
        .required(),
    },
  }),
  async (req: Request, res: Response) => {
    await categoryService.addTask({ ...req.body, ...req.params });
    res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
  }
);

categoryTaskRouter.delete(
  "/:task",
  celebrate({
    params: {
      task: CustomJoi.ObjectId().required(),
      category: CustomJoi.ObjectId().required(),
    },
  }),
  async (req: Request, res: Response) => {
    await categoryService.deleteTask(req.params as any);
    res.status(StatusCodes.OK).send(ReasonPhrases.OK);
  }
);
