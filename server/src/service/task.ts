import { Task, TaskDocument } from "../model/game/task";
import { BasicService } from "./utils/basic";

class TaskService extends BasicService<TaskDocument> {
  constructor() {
    super({ model: Task });
  }
}

export const taskService = new TaskService();
