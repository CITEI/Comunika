import { ObjectNotFoundError } from "../errors";
import mongoose from "mongoose";
import Service from "./service";

interface isinQuery {
  _id?: string;
  [key: string]: any;
}

export class BasicService<
  D extends mongoose.Document & I,
  I = object
> extends Service {
  protected model: mongoose.Model<D>;
  protected select: string;

  constructor({
    model,
    select,
  }: {
    model: mongoose.Model<D>;
    select?: string;
  }) {
    super();
    this.model = model;
    this.select = select || "";
  }

  /**
   * Obtains all stored documents
   */
  findAll(input?: I): Promise<Array<D>> {
    return this.model.find({}).select(this.select).exec();
  }

  /**
   * Returns a specific document
   */
  async find(args: { by: isinQuery; select?: string }): Promise<D> {
    const doc = await this.model
      .findOne(args.by)
      .select(args.select || this.select)
      .exec();
    if (doc) return doc;
    else throw new ObjectNotFoundError({ schema: this.model });
  }

  /**
   * Checks if a specific document exists
   */
  async exists(by: isinQuery): Promise<boolean> {
    return (await this.model.exists(by).exec()) != null;
  }

  /**
   * Creates a new document
   */
  async create(input: I): Promise<D> {
    const doc = new this.model(input);
    await doc.save();
    return doc;
  }

  /**
   * Deletes a document
   */
  async delete(by: isinQuery) {
    if (await this.exists(by)) await this.model.deleteOne(by);
    else throw new ObjectNotFoundError({ schema: this.model });
  }
}
