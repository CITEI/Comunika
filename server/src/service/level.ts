import { ILevel, ILevelDocument, Level } from "../model/game/level";
import { LinkedListService } from "./utils/linkedlist";

export default class LevelService extends LinkedListService<ILevel, ILevelDocument> {
  constructor() {
    super({ model: Level, select: "name categories" });
  }
}

export const levelService = new LevelService();
