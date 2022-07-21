import { levelService } from "../../service/level";
import { celebrate } from "celebrate";
import { Router, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { levelCategoryRouter } from "./category";
import { CustomJoi } from "../utils/custom_joi";
import passport from "passport";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.get("/", async (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json(await levelService.findAll());
});

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

router.use(
  "/:level/category",
  celebrate({ params: { level: CustomJoi.ObjectId().required() } }),
  levelCategoryRouter
);

export default router;
