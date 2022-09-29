import { Disability, DisabilityDocument } from "../model/disability";
import { BasicService } from "./utils/basic";

class DisabilityService extends BasicService<DisabilityDocument> {
  constructor() {
    super({ model: Disability });
  }
}

export const disabilityService = new DisabilityService();
