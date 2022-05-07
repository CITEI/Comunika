import { categoryService } from "../service/category";
import { celebrate, Joi } from "celebrate";
import { Request, Response, Router } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Task } from "src/model/game/task";
import {
  NodeDiscriminators,
  QuestionNodeDiscriminators,
} from "../model/game/node";

const router = Router();

router.post(
  "/",
  celebrate({
    body: {
      name: Joi.string().required(),
      description: Joi.string().required(),
      iconUrl: Joi.string().required(),
      level: Joi.string().required(),
    },
  }),
  async (req: Request, res: Response) => {
    await categoryService.create(req.body);
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
    const next = await categoryService.findNext({ id: req.params.id });
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
    await categoryService.delete({ id: req.params.id });
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
    await categoryService.swap({ from: req.body.from, to: req.body.to });
    res.status(StatusCodes.OK).send(ReasonPhrases.OK);
  }
);

router.post(
  "/task",
  celebrate({
    body: {
      category: Joi.string().required(),
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
      question_nodes: Joi.array()
        .items(
          Joi.object({
            type: Joi.string()
              .valid(...Object.keys(QuestionNodeDiscriminators))
              .required(),
            title: Joi.string().required(),
            question: Joi.string().required()
          }).unknown(true)
        )
        .min(1)
        .required(),
    },
  }),
  async (req: Request, res: Response) => {
    await categoryService.add_task(req.body);
    res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
  }
);

export default router;
