import { ObjectNotFoundError } from "../errors";
import mongoose from "mongoose";
import Service from "./service";

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
  async find(args: {
    by: { [key: string]: any } | string;
    select?: string;
  }): Promise<D> {
    const query =
      typeof args.by == "string"
        ? this.model.findById(args.by)
        : this.model.findOne(args.by as any);
    const doc = await query.select(args.select || this.select).exec();
    if (doc) return doc;
    else throw new ObjectNotFoundError({ schema: this.model });
  }

  /**
   * Checks if a specific document exists
   */
  async exists(by: string | { [key: string]: any }): Promise<boolean> {
    let exist = null;
    if (typeof by == "string")
      exist = await this.model.exists({ _id: by }).exec();
    else exist = await this.model.exists(by as any).exec();
    return exist == null;
  }

  /**
   * Creates a new document
   */
  async create(input: I): Promise<D> {
    const doc = new this.model(input);
    await doc.save();
    return doc;
  }
}
