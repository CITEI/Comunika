import { BasicService } from './utils/basic';
import { AccountTokenInput, AccountToken, AccountTokenDocument } from '../model/accountToken';
import crypto from 'crypto';

class AccountTokenService extends BasicService<AccountTokenDocument> {
  constructor() {
    super({ model: AccountToken });
  }

  /**
   * Creates a new token
   * 
   * @param payload Payload to create the token
   * @returns The created token
   */
  async create(payload: AccountTokenInput): Promise<AccountTokenDocument> {
    const token = new AccountToken(payload);
    await token.save();
    return token;
  }

  /**
   * Generates a token of a given size
   *
   * @param size The size of the token
   * @returns A string with 6 random characters [0-9 or A-Z]
   */
  async generateToken(size: number): Promise<string> {
    // Creates an array with the given size
    // And maps it with a random character/number
    return [...Array(size)].map(() => {
      return Math.floor(Math.random() * 36).toString(36)
    }).join('').toUpperCase();
  }

  /**
   * Validate the given token with the one stored in the database.
   * 
   * @param email Email of the user
   * @param token Token to be validated
   * @returns boolean
   */
  async validate(email: string, token: string): Promise<boolean> {
    const tokenDocument = await AccountToken.findOne({ email }).exec(); 
    if (tokenDocument?.token == token.toUpperCase()) return true;
    else return false;
  }
}

export const accountTokenService = new AccountTokenService();