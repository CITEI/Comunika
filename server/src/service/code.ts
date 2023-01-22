import { BasicService } from "./utils/basic";
import _ from "underscore";
import { Code, CodeDocument, CodeInput } from "../model/code";

class CodeService extends BasicService<CodeDocument> {
  constructor() {
    super({ model: Code });
  }

  /**
   * Create a new code and initializes it
   */
  async create(payload: CodeInput): Promise<CodeDocument> {
    const data = new Code(payload);
    await data.save();
    return data;
  }

  /**
   * Validate code by email;
   */
  async validate({
    email,
    code,
  }: {
    email: string;
    code: string;
  }): Promise<boolean> {
    const data = await Code.findOne({ email }).exec();

    if (data?.code == code) return true;
    else return false;
  }
}

export const codeService = new CodeService();
