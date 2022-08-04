import { Game, GameDocument } from "../model/game/game";
import { ModuleDocument, Module } from "../model/game/module";
import { LinkedListService } from "./utils/linkedlist";

export default class ModuleService extends LinkedListService<ModuleDocument, GameDocument> {
  constructor() {
    super({
      model: Module,
      select: "name description image imageAlt next",
      metaModel: Game,
      createMeta: true,
    });
  }
}

export const moduleService = new ModuleService();
