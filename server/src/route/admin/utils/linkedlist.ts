import { ResourceOptions } from "adminjs";


export const linkedListProperties: ResourceOptions["properties"] = {
  previous: {
    isVisible: {edit: false, filter: true, list: true, show: true}
  },
}
