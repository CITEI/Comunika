import mongoose from "mongoose";
import { ILevel, ILevelDocument, Level } from "../model/game/level";
import {
  AttributeNotFoundError,
  InternalServerError,
  ObjectNotFoundError,
} from "./errors";

const RETURN_FIELDS = "name categories";

/**
 * Obtains all stored levels
 */
export async function findLevels(): Promise<Array<ILevelDocument>> {
  return Level.find({}).select(RETURN_FIELDS).exec();
}

/**
 * Obtains the last element of the linked list
 */
async function getLast(): Promise<ILevelDocument | null> {
  return Level.findOne({ next: null }).exec();
}

/**
 * Creates a new level and appends it to the end
 */
export async function createLevel({
  name,
}: {
  name: string;
}): Promise<ILevelDocument> {
  let last = await getLast();

  // creates a new level
  let lvl: ILevel = {
    name,
  };
  let level = new Level(lvl);
  await level.save();

  // updates last next
  if (last) {
    last.next = level;
    await last.save();
  }

  return level;
}

/**
 * Finds the successor level given a level id
 */
export async function findNext({
  id,
}: {
  id: string;
}): Promise<ILevelDocument | null> {
  let current = await Level.findById(id)
    .populate("next", RETURN_FIELDS)
    .exec();
  if (current) return current.next;
  else throw new ObjectNotFoundError({ schema: "Level" });
}

/**
 * Removes a level from the db
 */
export async function deleteLevel({ id }: { id: string }) {
  let child = await Level.findById(id).exec();
  if (child) {
    let parent = await Level.findOne({ next: { $eq: id } }).exec();

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
  } else throw new ObjectNotFoundError({ schema: "Level" });
}

/**
 * Swap order of levels
 */
export async function swapLevels({ from, to }: { from: string; to: string }) {
  // RB -> B -> RD -> D
  // B <-> D
  let [b, d, rb, rd] = await Promise.all([
    Level.findById(from).exec(),
    Level.findById(to).exec(),
    Level.findOne({ next: from }).exec(),
    Level.findOne({ next: to }).exec(),
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
  throw new ObjectNotFoundError({ schema: "Level" });
}
