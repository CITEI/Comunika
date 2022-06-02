import { ResourceOptions } from "adminjs"


const userOptions: ResourceOptions = {
  actions: {
    new: {
      handler: async (req, res, con) => {
        return res
      }
    }
  }
}

export default userOptions
