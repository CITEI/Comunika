import mongoose from "mongoose";
import { LevelDocument } from "./level";

export interface InputGame {}

export const GameSchema = new mongoose.Schema({
  children_head: {
    type: mongoose.Types.ObjectId,
    ref: "Level",
    default: null,
    required: false,
  },
  children_tail: {
    type: mongoose.Types.ObjectId,
    ref: "Level",
    default: null,
    required: false,
  },
});

export interface GameDocument extends mongoose.Document, InputGame {
  children_head: mongoose.PopulatedDoc<LevelDocument> | null;
  children_tail: mongoose.PopulatedDoc<LevelDocument> | null;
}

export const Game = mongoose.model<GameDocument>("Game", GameSchema);
