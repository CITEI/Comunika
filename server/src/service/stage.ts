import { Game, GameDocument } from "../model/game/game";
import { StageDocument, Stage } from "../model/game/stage";
import { LinkedListService } from "./utils/linkedlist";

export default class StageService extends LinkedListService<StageDocument, GameDocument> {
  constructor() {
    super({
      model: Stage,
      select: "name description image imageAlt next",
      metaModel: Game,
      createMeta: true,
    });
  }
}

export const stageService = new StageService();
