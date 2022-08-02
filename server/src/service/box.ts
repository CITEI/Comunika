import {
  Box,
  BoxInput,
  BoxDocument,
} from "../model/game/box";
import { Stage, StageDocument } from "../model/game/stage";
import { Activity, ActivityDocument, ActivityInput } from "../model/game/activity";
import { ObjectNotFoundError } from "./errors";
import { activitieservice } from "./activity";
import { LinkedListService } from "./utils/linkedlist";
import underscore from "underscore";

export default class BoxService extends LinkedListService<
  BoxDocument,
  StageDocument
> {
  constructor() {
    super({
      model: Box,
      select: "name description stage next",
      metaModel: Stage,
      createMeta: false,
    });
  }

  /**
   * Makes meta
   */
  protected async findMeta(
    input: BoxInput
  ): Promise<StageDocument | null> {
    return this.metaModel.findById(input.stage).exec();
  }

  async findAll({
    stage,
  }: {
    stage: string;
  }): Promise<Array<BoxDocument>> {
    return Box.find({ stage: stage }).select(this.select).exec();
  }

  /**
   * Adds a activity to a box
   */
  async addActivity(
    payload: ActivityInput & { box: string }
  ): Promise<ActivityDocument> {
    if (await Box.exists({ _id: payload.box }).exec()) {
      const activity = await activitieservice.create(payload);
      await Box.updateOne(
        { _id: payload.box },
        { $push: { activities: activity } }
      );
      return activity;
    } else throw new ObjectNotFoundError({ schema: Box });
  }

  /**
   * Finds a box by a activity
   */
  async findByActivity({
    activity,
    select,
  }: {
    activity: string;
    select?: string;
  }): Promise<BoxDocument | null> {
    return await Box.findOne({ activities: { $in: [activity] } })
      .select(select || "")
      .exec();
  }

  /**
   * Removes a activity from a box
   */
  async deleteActivity({ box, activity }: { box?: string; activity: string }) {
    if (!(await Activity.exists({ _id: activity }).exec()))
      throw new ObjectNotFoundError({ schema: Activity });

    if (!box) {
      box = (await this.findByActivity({ activity, select: "_id" }))?._id;
      if (!box) throw new ObjectNotFoundError({ schema: Box });
    } else if (!(await Box.exists({ _id: box }).exec()))
      throw new ObjectNotFoundError({ schema: Box });

    await Box.findByIdAndUpdate(box, {
      $pull: { activities: activity },
    }).exec();
    await Activity.findByIdAndDelete(activity);
  }

  /**
   * Obtains at most `quantity` number of activities from a box
   */
  async sampleActivities({
    id,
    quantity,
  }: {
    id: string;
    quantity: number;
  }): Promise<Array<string>> {
    const box = await this.find({ by: { _id: id }, select: "activities" });
    if (box) return underscore.sample(box.activities, quantity);
    else return [];
  }
}

export const boxService = new BoxService();
