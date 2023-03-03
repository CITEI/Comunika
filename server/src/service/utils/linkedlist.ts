import mongoose, { Types } from "mongoose";
import { ObjectNotFoundError } from "../errors";
import { BasicService } from "./basic";

interface LinkedList extends mongoose.Document {
  previous?: mongoose.PopulatedDoc<LinkedList> | null;
}

export class LinkedListService<
  D extends LinkedList & I,
  I = object
> extends BasicService<D, I> {
  constructor({
    model,
    select,
  }: {
    model: mongoose.Model<D>;
    select?: string;
  }) {
    super({ model, select });
  }

  async orderList(list: D[]) {
    const orderedList = [];

    // This will be the first item in the list
    let next: D | null = list.find(item => item.previous == null) ?? null;
    while (next != null) {
      orderedList.push(next);
      next = await this.findNext(next._id);
    }

    return orderedList;
  }

  /**
   * Creates a new linked list object and appends it to the end
   */
  async create(input: I): Promise<D> {
    const doc = new this.model(input);
    let all = await this.findAll();
    all = await this.orderList(all);

    try {
      if (all.length == 0) {
        doc.previous = null;
      } else {
        const last = all.pop();
        doc.previous = last;
      }
      doc.save();
    } catch (error) {
      throw error;
    }

    return doc;
  }

  /**
   * Removes a linked list from the db
   */
  async delete({ id }: { id: string }) {
    const current = await this.model.findById(id).exec();

    if (current) {
      const previous = current.previous;
      const next = await this.model.findOne({ previous: { $eq: id } }).exec();

      try {
        if (next != null) {
          next.previous = previous;
          await next.save();
        }
        await current.delete();
      } catch (error) {
        throw error;
      }
    } else throw new ObjectNotFoundError({ schema: this.model });
  }

  /**
   * Returns the next document
   */
  async findNext(id: string): Promise<D | null> {
    const doc = await this.model.findOne({ previous: id }).exec();
    if (doc) return doc;
    else return null;
  }

}
