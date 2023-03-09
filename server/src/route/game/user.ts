import { userService } from "../../service/user";
import { celebrate, Joi } from "celebrate";
import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import passport from "passport";
import { UserDocument } from "src/model/user";
import { CustomJoi } from '../utils/custom_joi';

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.get(
  "/modules", 
  async (req: Request, res: Response) => {
    const id = (req.user as UserDocument)._id;
    const modules = await userService.findModules(id);
    res.status(StatusCodes.OK).send(modules);
  }
);

router.get(
  "/box/:id",
  celebrate({
    params: {
      id: CustomJoi.ObjectId().required(),
    },
  }),
  async (req: Request, res: Response) => {
    const id = (req.user as UserDocument)._id;
    const box = await userService.findBox({ "id": id, "module": req.params.id });
    res.status(StatusCodes.OK).send(box);
  }
);

router.post(
  "/box/:id",
  celebrate({
    params: {
      id: CustomJoi.ObjectId().required(),
    },
    body: {
      answers: Joi.array().items(Joi.array().items(Joi.alternatives().try(Joi.string(), Joi.boolean()))).required(),
    },
  }),
  async (req: Request, res: Response) => { 
    const id: string = (req.user as UserDocument)._id;
    const grade = await userService.evaluate(id, req.params.id, req.body.answers);
    res.status(StatusCodes.OK).send({ grade: grade });
  }
);

router.get(
  "/history",
  async (req: Request, res: Response) => {
    const id = (req.user as UserDocument)._id;
    const history = await userService.findHistory({ id });
    res.status(StatusCodes.OK).send(history);
  }
);

router.get(
  "/",
  async (req: Request, res: Response) => {
    const id = (req.user as UserDocument)._id;
    res
      .status(StatusCodes.OK)
      .send(await userService.findUserData({ id }));
  }
);

export default router;
