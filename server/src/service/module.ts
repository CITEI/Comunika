import { Game, GameDocument } from "../model/game";
import { ModuleDocument, Module } from "../model/module";
import { LinkedListService } from "./utils/linkedlist";
import underscore from "underscore";

export default class ModuleService extends LinkedListService<ModuleDocument, GameDocument> {
  constructor() {
    super({
      model: Module,
      select: "name image imageAlt next",
      metaModel: Game,
      createMeta: true,
    });
  }

  async sampleActivities({
    id, 
    quantity, 
    alternative
  }: {
    id: string, 
    quantity: number, 
    alternative: boolean
  }): Promise<Array<string>>{
    const field = alternative ? "alternativeActivities" : "activities";
    const module = await this.find({by: {_id: id}, select: field});
    if (module) return underscore.sample(module[field], quantity);
    else return [];
  }
}

export const moduleService = new ModuleService();
