import bcrypt from 'bcrypt';


export const SALT_ROUNDS = 10;

/** Hashes a string with bcrypt */
export async function hashPassword(password: string): Promise<string>
{
    return bcrypt.hash(password, SALT_ROUNDS)
}

/** True if a plain password is equal to a hashed one */
export async function passwordsMatch(
    password: string, hashed: string): Promise<boolean>
{
    return bcrypt.compare(password, hashed);
}

