import mongoose from "mongoose";
import { LevelDocument } from "./level";

export interface InputGame {}

export const GameSchema = new mongoose.Schema({
  childrenHead: {
    type: mongoose.Types.ObjectId,
    ref: "Level",
    default: null,
    required: false,
  },
  childrenTail: {
    type: mongoose.Types.ObjectId,
    ref: "Level",
    default: null,
    required: false,
  },
});

export interface GameDocument extends mongoose.Document, InputGame {
  childrenHead: mongoose.PopulatedDoc<LevelDocument> | null;
  childrenTail: mongoose.PopulatedDoc<LevelDocument> | null;
}

export const Game = mongoose.model<GameDocument>("Game", GameSchema);
