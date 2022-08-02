import { Activity, ActivityDocument } from "../model/game/activity";
import { BasicService } from "./utils/basic";

class Activitieservice extends BasicService<ActivityDocument> {
  constructor() {
    super({ model: Activity });
  }
}

export const activitieservice = new Activitieservice();
