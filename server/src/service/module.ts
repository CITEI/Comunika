import { Game, GameDocument } from "../model/game";
import { ModuleDocument, Module } from "../model/module";
import { LinkedListService } from "./utils/linkedlist";

export default class ModuleService extends LinkedListService<ModuleDocument, GameDocument> {
  constructor() {
    super({
      model: Module,
      select: "name image imageAlt next",
      metaModel: Game,
      createMeta: true,
    });
  }
}

export const moduleService = new ModuleService();
