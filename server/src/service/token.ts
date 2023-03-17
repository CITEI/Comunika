import { BasicService } from './utils/basic';
import { TokenInput, Token, TokenDocument } from '../model/token';
import crypto from 'crypto';

class TokenService extends BasicService<TokenDocument> {
  constructor() {
    super({ model: Token });
  }

  /**
   * Creates a new token and send the email to the user.
   * 
   * @param payload Payload to create the token, can contain only the user's ID
   * @returns The created token
   */
  async create(payload: TokenInput): Promise<TokenDocument> {
    const token = new Token(payload);
    await token.save();
    return token;
  }

  async generateToken(): Promise<string> {
    return crypto.randomBytes(6).toString('hex');
  }
}

export const tokenService = new TokenService();