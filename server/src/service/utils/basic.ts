import { ObjectNotFoundError } from "../errors";
import mongoose from "mongoose";
import Service from "./service";

export default class BasicService<
  I,
  M extends I & mongoose.Document
> extends Service {
  protected model: mongoose.Model<M>;
  protected select: string;

  constructor({
    model,
    select,
  }: {
    model: mongoose.Model<M>;
    select?: string;
  }) {
    super();
    this.model = model;
    this.select = select || "";
  }

  /**
   * Obtains all stored documents
   */
  findAll(): Promise<Array<M>> {
    return this.model.find({}).select(this.select).exec();
  }

  /**
   * Returns a specific document
   */
  find({ id }: { id: string }): Promise<M | null> {
    const doc = this.model.findById(id).select(this.select).exec();
    if (doc) return doc;
    else throw new ObjectNotFoundError({ schema: this.model.name });
  }

  /**
   * Creates a new document
   */
  async create(input: I): Promise<M> {
    const doc = new this.model(input);
    await doc.save();
    return doc;
  }
}
