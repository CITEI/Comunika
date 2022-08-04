import {
  Stage,
  StageInput,
  StageDocument,
} from "../model/game/stage";
import { Module, ModuleDocument } from "../model/game/module";
import { Activity, ActivityDocument, ActivityInput } from "../model/game/activity";
import { ObjectNotFoundError } from "./errors";
import { activitieservice } from "./activity";
import { LinkedListService } from "./utils/linkedlist";
import underscore from "underscore";

export default class StageService extends LinkedListService<
  StageDocument,
  ModuleDocument
> {
  constructor() {
    super({
      model: Stage,
      select: "name description module image imageAlt next",
      metaModel: Module,
      createMeta: false,
    });
  }

  /**
   * Makes meta
   */
  protected async findMeta(
    input: StageInput
  ): Promise<ModuleDocument | null> {
    return this.metaModel.findById(input.module).exec();
  }

  async findAll({
    module,
  }: {
    module: string;
  }): Promise<Array<StageDocument>> {
    return Stage.find({ module: module }).select(this.select).exec();
  }

  /**
   * Adds a activity to a stage
   */
  async addActivity(
    payload: ActivityInput & { stage: string }
  ): Promise<ActivityDocument> {
    if (await Stage.exists({ _id: payload.stage }).exec()) {
      const activity = await activitieservice.create(payload);
      await Stage.updateOne(
        { _id: payload.stage },
        { $push: { activities: activity } }
      );
      return activity;
    } else throw new ObjectNotFoundError({ schema: Stage });
  }

  /**
   * Finds a stage by a activity
   */
  async findByActivity({
    activity,
    select,
  }: {
    activity: string;
    select?: string;
  }): Promise<StageDocument | null> {
    return await Stage.findOne({ activities: { $in: [activity] } })
      .select(select || "")
      .exec();
  }

  /**
   * Removes a activity from a stage
   */
  async deleteActivity({ stage, activity }: { stage?: string; activity: string }) {
    if (!(await Activity.exists({ _id: activity }).exec()))
      throw new ObjectNotFoundError({ schema: Activity });

    if (!stage) {
      stage = (await this.findByActivity({ activity, select: "_id" }))?._id;
      if (!stage) throw new ObjectNotFoundError({ schema: Stage });
    } else if (!(await Stage.exists({ _id: stage }).exec()))
      throw new ObjectNotFoundError({ schema: Stage });

    await Stage.findByIdAndUpdate(stage, {
      $pull: { activities: activity },
    }).exec();
    await Activity.findByIdAndDelete(activity);
  }

  /**
   * Obtains at most `quantity` number of activities from a stage
   */
  async sampleActivities({
    id,
    quantity,
  }: {
    id: string;
    quantity: number;
  }): Promise<Array<string>> {
    const stage = await this.find({ by: { _id: id }, select: "activities" });
    if (stage) return underscore.sample(stage.activities, quantity);
    else return [];
  }
}

export const stageService = new StageService();
