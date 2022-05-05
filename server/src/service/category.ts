import {
  Category,
  CategoryInput,
  CategoryDocument,
} from "src/model/game/category";
import { Level, LevelDocument } from "src/model/game/level";
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
}

export const categoryService = new CategoryService();
