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


  /**
   * Returns the last document in the list
   */
  async findLast(l?: D[]): Promise<D | null> {
    // if no list is provided it will fetch all the documents
    const list = l ?? await this.findAll();

    // This will be the first item in the list
    let next: D | null = list.find(item => item.previous == null) ?? null;

    while (next != null) {
      let found = list.find(item => item.previous == next!.id);
      // if found is underfined then we have reached the end of the list
      if (!found) break;
      else next = found;
    }

    return next;
  }

  /**
   * Creates a new linked list object and appends it to the end
   */
  async create(input: I): Promise<D> {
    const doc = new this.model(input);
    const last = await this.findLast();

    try {
      if (!last) {
        doc.previous = null;
      } else {
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
      const next = await this.findNext(current.id);

      try {
        if (next != null) {
          next.previous = current.previous;
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
