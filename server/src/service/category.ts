import {
  Category,
  CategoryInput,
  CategoryDocument,
} from "../model/game/category";
import { Level, LevelDocument } from "../model/game/level";
import { Task } from "../model/game/task";
import { ObjectNotFoundError } from "./errors";
import { taskService } from "./task";
import { LinkedListService } from "./utils/linkedlist";

export default class CategoryService extends LinkedListService<
  CategoryDocument,
  LevelDocument
> {
  constructor() {
    super({
      model: Category,
      select: "name description iconUrl level",
      meta_model: Level,
      create_meta: false,
    });
  }

  protected async findMeta(
    input: CategoryInput
  ): Promise<LevelDocument | null> {
    return this.meta_model.findById(input.level).exec();
  }

  /**
   * Adds a task to a category
   */
  async add_task(payload: any) {
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
  async delete_task({category, task}:{category: string, task: string}) {
    if (await Category.exists({_id: category}).exec()) {
      if (await Task.exists({_id: task}).exec()) {
        await Category.findByIdAndUpdate
    } else
    throw new ObjectNotFoundError({schema: Task})
  } else
  throw new ObjectNotFoundError({schema: Category})
  }
}

export const categoryService = new CategoryService();
