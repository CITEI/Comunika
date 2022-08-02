import { boxService } from "../../service/box";
import { celebrate } from "celebrate";
import { Request, Response, Router } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { CustomJoi } from "../utils/custom_joi";
import passport from "passport";

/**
 * Box only routes
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
    const next = await boxService.findNext({ id: req.params.id });
    if (next) res.status(StatusCodes.OK).json(next);
    else res.status(StatusCodes.NO_CONTENT).send(ReasonPhrases.NO_CONTENT);
  }
);

export default router;

/**
 * Required stage id routes
 */
export const stageBoxRouter = Router({ mergeParams: true });

stageBoxRouter.get(
  "/",
  async (req: Request, res: Response) => {
    res
      .status(StatusCodes.OK)
      .send(await boxService.findAll(req.params as any));
  }
);
