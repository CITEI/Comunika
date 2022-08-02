import mongoose from "mongoose";
import { StageDocument } from "./stage";

export interface InputGame {}

export const GameSchema = new mongoose.Schema({
  childrenHead: {
    type: mongoose.Types.ObjectId,
    ref: "Stage",
    default: null,
    required: false,
  },
  childrenTail: {
    type: mongoose.Types.ObjectId,
    ref: "Stage",
    default: null,
    required: false,
  },
});

export interface GameDocument extends mongoose.Document, InputGame {
  childrenHead: mongoose.PopulatedDoc<StageDocument> | null;
  childrenTail: mongoose.PopulatedDoc<StageDocument> | null;
}

export const Game = mongoose.model<GameDocument>("Game", GameSchema);
