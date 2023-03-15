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
    if (!payload.token) {
      payload.token = await this.generateToken();
    }
    const token = new Token(payload);
    await token.save();
    return token;
  }

  protected async generateToken(): Promise<string> {
    return crypto.randomBytes(32).toString('hex');
  }
}

export const tokenService = new TokenService();