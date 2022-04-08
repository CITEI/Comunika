import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRATION } from 'src/pre-start/constants'
import { IUser, IUserDocument, User } from '../model/user/user'
import { DuplicatedError } from './errors'


/**
 * Registers a new user into the db
 */
export async function registerUser(params: IUser): Promise<IUserDocument>
{
    if (await User.findOne({email: params.email}) == null)
        return User.create(params)
    else
        throw new DuplicatedError('User', 'email')
}

/**
 * Creates a jwt token for an user
 */
export async function loginUser(
    payload: {id: string, email: string}): Promise<string>
{
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRATION,
        algorithm: JWT_ALGORITHM
    })
}
