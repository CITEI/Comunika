import { Game, GameDocument } from "../model/game/game";
import { LevelDocument, Level } from "../model/game/level";
import { LinkedListService } from "./utils/linkedlist";

export default class LevelService extends LinkedListService<LevelDocument, GameDocument> {
  constructor() {
    super({
      model: Level,
      select: "name description image imageAlt next",
      metaModel: Game,
      createMeta: true,
    });
  }
}

export const levelService = new LevelService();
