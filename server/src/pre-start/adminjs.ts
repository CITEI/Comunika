import AdminJS, { ResourceWithOptions } from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSMongoose from "@adminjs/mongoose";
import { API_VERSION, APP_NAME } from "./constants";
import { User, UserDocument } from "../model/game/user";
import { Task } from "../model/game/task";
import { Level } from "../model/game/level";
import { Category } from "../model/game/category";

AdminJS.registerAdapter(AdminJSMongoose);

const adminJs = new AdminJS({
  resources: [
    {
      resource: User,
      options: {
        navigation: {
          name: 'Manage',
          icon: ''
        },
        properties: {
          progress: {
            isVisible: { edit: false, filter: false, list: false, show: false },
          },
        },
        actions: {
          new: {
            handler: async (request, response, context): Promise<any> => {
              console.log(request.payload)
              return {}
            }
          }
        }
      },
    },
  ] as Array<ResourceWithOptions>,
  branding: {
    companyName: APP_NAME,
    logo: APP_NAME,
    softwareBrothers: false,
  },
  version: {
    app: API_VERSION,
  },
});

export default (options: { route: string }) => {
  adminJs.options.rootPath = options.route;
  return AdminJSExpress.buildRouter(adminJs);
};
