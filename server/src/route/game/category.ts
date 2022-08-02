import { categoryService } from "../../service/category";
import { celebrate } from "celebrate";
import { Request, Response, Router } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { CustomJoi } from "../utils/custom_joi";
import passport from "passport";

/**
 * Category only routes
 */
const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

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

export default router;

/**
 * Required stage id routes
 */
export const stageCategoryRouter = Router({ mergeParams: true });

stageCategoryRouter.get(
  "/",
  async (req: Request, res: Response) => {
    res
      .status(StatusCodes.OK)
      .send(await categoryService.findAll(req.params as any));
  }
);
