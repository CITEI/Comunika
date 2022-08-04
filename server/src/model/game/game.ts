import mongoose from "mongoose";
import { ModuleDocument } from "./module";

export interface InputGame {}

export const GameSchema = new mongoose.Schema({
  childrenHead: {
    type: mongoose.Types.ObjectId,
    ref: "Module",
    default: null,
    required: false,
  },
  childrenTail: {
    type: mongoose.Types.ObjectId,
    ref: "Module",
    default: null,
    required: false,
  },
});

export interface GameDocument extends mongoose.Document, InputGame {
  childrenHead: mongoose.PopulatedDoc<ModuleDocument> | null;
  childrenTail: mongoose.PopulatedDoc<ModuleDocument> | null;
}

export const Game = mongoose.model<GameDocument>("Game", GameSchema);
