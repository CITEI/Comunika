import { Activity, ActivityDocument } from "../model/game/activity";
import { BasicService } from "./utils/basic";

class ActivityService extends BasicService<ActivityDocument> {
  constructor() {
    super({ model: Activity });
  }
}

export const activityService = new ActivityService();
