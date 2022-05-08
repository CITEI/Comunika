import {
  Category,
  CategoryInput,
  CategoryDocument,
} from "../model/game/category";
import { Level, LevelDocument } from "../model/game/level";
import { Task, TaskInput } from "../model/game/task";
import { ObjectNotFoundError } from "./errors";
import { taskService } from "./task";
import { LinkedListService } from "./utils/linkedlist";
import underscore from "underscore";

export default class CategoryService extends LinkedListService<
  CategoryDocument,
  LevelDocument
> {
  constructor() {
    super({
      model: Category,
      select: "name description iconUrl level",
      metaModel: Level,
      createMeta: false,
    });
  }

  /**
   * Makes meta
   */
  protected async findMeta(
    input: CategoryInput
  ): Promise<LevelDocument | null> {
    return this.metaModel.findById(input.level).exec();
  }

  async findAll({
    level,
  }: {
    level: string;
  }): Promise<Array<CategoryDocument>> {
    return Category.find({ level: level }).select(this.select).exec();
  }

  /**
   * Adds a task to a category
   */
  async addTask(payload: TaskInput & { category: string }) {
    if (await Category.exists({ _id: payload.category }).exec()) {
      const task = await taskService.create(payload);
      await Category.updateOne(
        { _id: payload.category },
        { $push: { tasks: task } }
      );
    } else throw new ObjectNotFoundError({ schema: Category });
  }

  /**
   * Removes a task from a category
   */
  async deleteTask({ category, task }: { category: string; task: string }) {
    if (await Category.exists({ _id: category }).exec()) {
      if (await Task.exists({ _id: task }).exec()) {
        await Category.findByIdAndUpdate(category, {
          $pull: { tasks: task },
        }).exec();
        await Task.findByIdAndDelete(task);
      } else throw new ObjectNotFoundError({ schema: Task });
    } else throw new ObjectNotFoundError({ schema: Category });
  }

  /**
   * Obtains at most `quantity` number of tasks from a category
   */
  async sampleTasks({
    id,
    quantity,
  }: {
    id: string;
    quantity: number;
  }): Promise<Array<string>> {
    const category = await this.find({ id, select: "tasks" });
    return underscore.sample(category.tasks, quantity);
  }
}

export const categoryService = new CategoryService();
