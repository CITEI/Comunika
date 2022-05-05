import { ObjectNotFoundError } from "../errors";
import mongoose from "mongoose";
import Service from "./service";

export class BasicService<D extends mongoose.Document> extends Service {
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
  findAll(): Promise<Array<D>> {
    return this.model.find({}).select(this.select).exec();
  }

  /**
   * Returns a specific document
   */
  find({ id }: { id: string }): Promise<D | null> {
    const doc = this.model.findById(id).select(this.select).exec();
    if (doc) return doc;
    else throw new ObjectNotFoundError({ schema: this.model });
  }

  /**
   * Creates a new document
   */
  async create(input: any): Promise<D> {
    const doc = new this.model(input);
    await doc.save();
    return doc;
  }
}
