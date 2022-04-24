import mongoose from "mongoose";
import { InternalServerError, ObjectNotFoundError } from "../errors";
import BasicService from "./basic";

interface LinkedList<M extends mongoose.Document> {
  next?: mongoose.PopulatedDoc<M>;
}

export class LinkedListService<
  I extends LinkedList<M>,
  M extends I & mongoose.Document
> extends BasicService<I, M> {

  /**
   * Obtains the last element of the linked list
   */
  getLast(): Promise<M | null> {
    return this.model.findOne({ next: null }).exec();
  }

  /**
   * Creates a new LinkedList object and appends it to the end
   */
  async create(input: I): Promise<M> {
    let last = await this.getLast();

    // creates a new level
    let doc = new this.model(input);
    await doc.save();

    // updates last next
    if (last) {
      last.next = doc;
      await last.save();
    }

    return doc;
  }

  /**
   * Removes a LinkedList from the db
   */
  async delete({ id }: { id: string }) {
    let child = await this.model.findById(id).exec();
    if (child) {
      let parent = await this.model.findOne({ next: { $eq: id } }).exec();

      // Changes must be sync
      const session = await mongoose.connection.startSession();
      await session.startTransaction();

      try {
        if (parent != null) {
          parent.next = child.next;
          await parent.save({ session });
        }
        await child.delete({ session });

        await session.commitTransaction();
        await session.endSession();
      } catch (e) /* istanbul ignore next */ {
        await session.abortTransaction();
        await session.endSession();
        throw new InternalServerError();
      }
    } else throw new ObjectNotFoundError({ schema: this.model.name });
  }

  /**
   * Finds the successor given a LinkedList id
   */
  async findNext({ id }: { id: string }): Promise<M | null> {
    let current = await this.model.findById(id).populate("next").exec();
    if (current) return current.next!;
    else throw new ObjectNotFoundError({ schema: this.model.name });
  }

  async swap({ from, to }: { from: string; to: string }) {
    // RB -> B -> RD -> D
    // B <-> D
    let [b, d, rb, rd] = await Promise.all([
      this.model.findById(from).exec(),
      this.model.findById(to).exec(),
      this.model.findOne({ next: from }).exec(),
      this.model.findOne({ next: to }).exec(),
    ]);

    if (b && d) {
      const toupdate = [b, d];
      // RB -> B -> D -> X -> null
      // RB -> D -> B -> X -> null
      if (d._id.equals(b.next)) {
        b.next = d.next; // <- X
        d.next = b._id;
        if (rb) {
          rb.next = d;
          toupdate.push(rb);
        }
      }
      // RD -> D -> B -> X -> null
      // RD -> B -> D -> X -> null
      else if (b._id.equals(d.next)) {
        d.next = b.next; // <- X
        b.next = d;
        if (rd) {
          rd.next = b;
          toupdate.push(rd);
        }
      } else {
        // RB -> B -> RD -> D -> null
        // RB -> D -> RD -> B -> null
        let aux = b.next;
        b.next = d.next; // <- null
        d.next = aux; // <- RD
        if (rb) {
          rb.next = d;
          toupdate.push(rb);
        }
        if (rd) {
          rd.next = b;
          toupdate.push(rd);
        }
      }

      const session = await mongoose.connection.startSession(); // all changes must be sync
      session.startTransaction();

      try {
        await Promise.all(toupdate.map((doc) => doc.save({ session })));
        await session.commitTransaction();
        await session.endSession();
      } catch (e) /* istanbul ignore next */ {
        await session.abortTransaction();
        await session.endSession();
        throw new InternalServerError();
      }

      return;
    }
    throw new ObjectNotFoundError({ schema: this.model.name });
  }
}
