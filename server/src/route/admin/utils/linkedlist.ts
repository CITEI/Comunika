import { ResourceOptions } from "adminjs";


export const linkedListProperties: ResourceOptions["properties"] = {
  childrenHead: {
    isVisible: {edit: false, filter: false, list: false, show: false}
  },
  childrenTail: {
    isVisible: {edit: false, filter: false, list: false, show: false}
  },
  next: {
    isVisible: {edit: false, filter: true, list: true, show: true}
  },
}
