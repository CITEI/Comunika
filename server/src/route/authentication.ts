import { loginUser, registerUser } from "@service/authentication";
import { Request, Response, Router } from "express";
import { IUser, IUserDocument } from "src/model/user/user";
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import { celebrate, Joi } from "celebrate";
import passport from "passport";


const router = Router();

router.post('/register',
    celebrate({
        body: {
            email: Joi.string().required(),
            password: Joi.string().required(),
            name: Joi.string().required()
        }
    }),
    async (req: Request, res: Response) => {
        await registerUser(req.body as IUser)
        res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED)
    }
)

router.post('/login',
    celebrate({
        body: {
            email: Joi.string().required(),
            password: Joi.string().required()
        }
    }),
    passport.authenticate('local', { session: false }),
    async (req: Request, res: Response) => {
        const user = req.user as IUserDocument
        const token = await loginUser({ id: user._id, email: user.email })
        res.status(StatusCodes.OK).json({token})
    }
)

export default router
