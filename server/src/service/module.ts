import { Game, GameDocument } from "../model/game";
import { ModuleDocument, Module } from "../model/module";
import { ActivityInput, ActivityDocument, Activity } from "../model/activity";
import { activityService } from "./activity";
import { LinkedListService } from "./utils/linkedlist";
import underscore from "underscore";
import { ObjectNotFoundError } from "./errors";

export default class ModuleService extends LinkedListService<ModuleDocument, GameDocument> {
  constructor() {
    super({
      model: Module,
      select: "name image imageAlt next",
      metaModel: Game,
      createMeta: true,
    });
  }

  async findByActivity({activity, select}: {
    activity: string; 
    select?:string
  }): Promise<ModuleDocument | null> {
    return await Module.findOne({activies: {$in: [activity]}})
      .select(select || "")
      .exec();
  }

  async addActivity(
    payload: ActivityInput & { module: string; alternative: boolean }
  ): Promise<ActivityDocument> {
    if (await Module.exists({ _id: payload.module }).exec()) {
      const activity = await activityService.create(payload);
      const field = payload.alternative ? "alternativeActivities" : "activities";
      await Module.updateOne({_id: payload.module}, {$push: {[field]: activity}});
      return activity;
    } else throw new ObjectNotFoundError({schema: Module});
  }

  async deleteActivity({
    module,
    activity,
  }: {
    module?: string;
    activity: string;
  }) {
    if (!(await Activity.exists({ _id: activity }).exec()))
      throw new ObjectNotFoundError({ schema: Activity });
    
    if (!module) {
      module = (await this.findByActivity({activity, select: "_id"}))?._id;
      if (!module) throw new ObjectNotFoundError({schema: Module});
    } else if (!(await Module.exists({_id: module}).exec()))
      throw new ObjectNotFoundError({schema: Module});

    await Module.findByIdAndUpdate(module, {
      $pull: { activities: activity }
    }).exec();

    await Activity.findByIdAndDelete(activity);
  }

  async sampleActivities({
    id,
    quantity,
    alternative
  }: {
    id: string,
    quantity: number,
    alternative: boolean
  }): Promise<Array<string>> {
    const field = alternative ? "alternativeActivities" : "activities";
    const module = await this.find({ by: { _id: id }, select: field });
    if (module) return underscore.sample(module[field], quantity);
    else return [];
  }
}

export const moduleService = new ModuleService();
