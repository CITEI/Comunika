import mongoose from "mongoose";
import { ObjectNotFoundError } from "../errors";
import { BasicService } from "./basic";

interface LinkedList extends mongoose.Document {
  next?: mongoose.PopulatedDoc<LinkedList> | null;
}

interface Meta<D extends LinkedList> extends mongoose.Document {
  children_head: mongoose.PopulatedDoc<D> | null;
  children_tail: mongoose.PopulatedDoc<D> | null;
}

export class LinkedListService<D extends LinkedList, M extends Meta<D>> extends BasicService<D> {
  protected meta_model: mongoose.Model<M>;
  protected create_meta: boolean;

  constructor({
    model,
    select,
    meta_model,
    create_meta,
  }: {
    model: mongoose.Model<D>;
    select?: string;
    meta_model: mongoose.Model<M>;
    create_meta?: boolean;
  }) {
    super({ model, select });
    this.meta_model = meta_model;
    this.create_meta = create_meta || false;
  }

  /**
   * Creates the metadata document
   */
  protected async initMeta(): Promise<M> {
    const meta = new this.meta_model({ head: null, tail: null });
    await meta.save();
    return meta;
  }

  /**
   * Returns the metadata document from the db
   */
  protected async findMeta(input?: any): Promise<M | null> {
    return this.meta_model.findOne().exec();
  }

  /**
   * Obtains the linked list metadata document
   */
  protected async getMeta(input?: any): Promise<M> {
    const meta = await this.findMeta(input);
    if (meta) return meta;
    else if (this.create_meta) return await this.initMeta();
    else throw new ObjectNotFoundError({ schema: this.meta_model });
  }

  /**
   * Obtains the first element of a linked list
   */
  protected async getHead(meta: M): Promise<D | null> {
    if (!meta.populated("children_head")) await meta.populate("children_head");
    return meta.children_head || null;
  }

  /**
   * Obtains the last element of the linked list
   */
  protected async getTail(meta: M): Promise<D | null> {
    if (!meta.populated("children_tail")) await meta.populate("children_tail");
    return meta.children_tail || null;
  }

  /**
   * Creates a new linked list object and appends it to the end
   */
  async create(input: any): Promise<D> {
    const meta = await this.getMeta(input);
    const last = await this.getTail(meta);

    // creates a new level
    let doc = new this.model(input);

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
      await doc.save({ session });

      // updates meta and linked list itself
      meta.children_tail = doc;
      if (meta.children_head) {
        last!.next = doc;
        await last!.save({ session });
      } else
        meta.children_head = doc;
      await meta.save({ session });

      await session.commitTransaction();
      await session.endSession();
    } catch (e) /* istanbul ignore next */ {
      await session.abortTransaction();
      await session.endSession();
      throw e;
    }

    return doc;
  }

  /**
   * Removes a linked list from the db
   */
  async delete({ id }: { id: string }) {
    let current = await this.model.findById(id).exec();

    if (current) {
      const parent = await this.model.findOne({ next: { $eq: id } }).exec();
      const meta = await this.getMeta();

      // Changes must be sync
      const session = await mongoose.connection.startSession();
      await session.startTransaction();

      try {
        if (parent != null) {
          // it is not the first
          parent.next = current.next;
          if (current._id.equals(meta.children_tail)) {
            // it is the last element of the linked list
            meta.children_tail = parent;
            await meta.save({ session });
          }
          await parent.save({ session });
        } else {
          // it is the first element
          meta.children_head = current.next;
          if (meta.children_head == null)
            // only one element in the list
            meta.children_tail = null;
          await meta.save({ session });
        }

        await current.delete({ session });

        await session.commitTransaction();
        await session.endSession();
      } catch (e) /* istanbul ignore next */ {
        await session.abortTransaction();
        await session.endSession();
        throw e;
      }
    } else throw new ObjectNotFoundError({ schema: this.model });
  }

  /**
   * Returns the first element of a linked list
   */
  async findFirst(input?: any): Promise<D | null> {
    return await this.getHead(await this.getMeta(input));
  }

  /**
   * Finds the successor given a LinkedList id
   */
  async findNext({ id }: { id: string }): Promise<D | null> {
    let current = await this.model.findById(id).populate("next").exec();
    if (current) return current.next || null;
    else throw new ObjectNotFoundError({ schema: this.model });
  }

  /**
   * Changes the position of two linked list elements
   */
  async swap({ from, to }: { from: string; to: string }) {
    // RB -> B -> RD -> D
    // B <-> D
    let [b, d] = await Promise.all([
      this.model.findById(from).exec(),
      this.model.findById(to).exec(),
    ]);

    if (b && d) {
      let [rb, rd] = await Promise.all([
        this.model.findOne({ next: from }).exec(),
        this.model.findOne({ next: to }).exec(),
      ]);

      const toupdate: Array<mongoose.Document> = [b, d];
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

      // if first, update meta
      const meta = await this.getMeta();
      if (b._id.equals(meta.children_head)) {
        meta.children_head = d;
        toupdate.push(meta);
      } else if (d._id.equals(meta.children_head)) {
        meta.children_head = b;
        toupdate.push(meta);
      }

      // if last, update meta
      if (b._id.equals(meta.children_tail)) {
        meta.children_tail = d;
        toupdate.push(meta);
      } else if (d._id.equals(meta.children_tail)) {
        meta.children_tail = b;
        toupdate.push(meta);
      }

      const session = await mongoose.connection.startSession(); // all changes must be sync
      session.startTransaction();

      try {
        for(let doc of toupdate)
          await doc.save({session}) // avoided Promise.all in order to reduce transient transaction errors
        await session.commitTransaction();
        await session.endSession();
      } catch (e) /* istanbul ignore next */ {
        await session.abortTransaction();
        await session.endSession();
        throw e;
      }

      return;
    }
    throw new ObjectNotFoundError({ schema: this.model });
  }
}
