import {
  Category,
  CategoryInput,
  CategoryDocument,
} from "../model/game/category";
import { Stage, StageDocument } from "../model/game/stage";
import { Activity, ActivityDocument, ActivityInput } from "../model/game/activity";
import { ObjectNotFoundError } from "./errors";
import { activitieservice } from "./activity";
import { LinkedListService } from "./utils/linkedlist";
import underscore from "underscore";

export default class CategoryService extends LinkedListService<
  CategoryDocument,
  StageDocument
> {
  constructor() {
    super({
      model: Category,
      select: "name description image imageAlt stage next",
      metaModel: Stage,
      createMeta: false,
    });
  }

  /**
   * Makes meta
   */
  protected async findMeta(
    input: CategoryInput
  ): Promise<StageDocument | null> {
    return this.metaModel.findById(input.stage).exec();
  }

  async findAll({
    stage,
  }: {
    stage: string;
  }): Promise<Array<CategoryDocument>> {
    return Category.find({ stage: stage }).select(this.select).exec();
  }

  /**
   * Adds a activity to a category
   */
  async addActivity(
    payload: ActivityInput & { category: string }
  ): Promise<ActivityDocument> {
    if (await Category.exists({ _id: payload.category }).exec()) {
      const activity = await activitieservice.create(payload);
      await Category.updateOne(
        { _id: payload.category },
        { $push: { activities: activity } }
      );
      return activity;
    } else throw new ObjectNotFoundError({ schema: Category });
  }

  /**
   * Finds a category by a activity
   */
  async findByActivity({
    activity,
    select,
  }: {
    activity: string;
    select?: string;
  }): Promise<CategoryDocument | null> {
    return await Category.findOne({ activities: { $in: [activity] } })
      .select(select || "")
      .exec();
  }

  /**
   * Removes a activity from a category
   */
  async deleteActivity({ category, activity }: { category?: string; activity: string }) {
    if (!(await Activity.exists({ _id: activity }).exec()))
      throw new ObjectNotFoundError({ schema: Activity });

    if (!category) {
      category = (await this.findByActivity({ activity, select: "_id" }))?._id;
      if (!category) throw new ObjectNotFoundError({ schema: Category });
    } else if (!(await Category.exists({ _id: category }).exec()))
      throw new ObjectNotFoundError({ schema: Category });

    await Category.findByIdAndUpdate(category, {
      $pull: { activities: activity },
    }).exec();
    await Activity.findByIdAndDelete(activity);
  }

  /**
   * Obtains at most `quantity` number of activities from a category
   */
  async sampleActivities({
    id,
    quantity,
  }: {
    id: string;
    quantity: number;
  }): Promise<Array<string>> {
    const category = await this.find({ by: { _id: id }, select: "activities" });
    if (category) return underscore.sample(category.activities, quantity);
    else return [];
  }
}

export const categoryService = new CategoryService();
