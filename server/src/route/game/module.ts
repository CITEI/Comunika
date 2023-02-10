import { moduleService } from "../../service/module";
import { celebrate } from "celebrate";
import { Router, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { CustomJoi } from "../utils/custom_joi";
import passport from "passport";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.get("/", async (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json(await moduleService.findAll());
});

router.get(
  "/:id/next",
  celebrate({
    params: {
      id: CustomJoi.ObjectId().required(),
    },
  }),
  async (req: Request, res: Response) => {
    const next = await moduleService.findNext({ id: req.params.id });
    if (next) res.status(StatusCodes.OK).json(next);
    else res.status(StatusCodes.NO_CONTENT).send(ReasonPhrases.NO_CONTENT);
  }
);

export default router;
