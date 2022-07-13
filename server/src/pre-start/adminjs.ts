import AdminJS, { ResourceOptions, ResourceWithOptions } from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSMongoose from "@adminjs/mongoose";
import { ADMIN_SECRET, API_VERSION, APP_NAME } from "./constants";
import { User } from "../model/game/user";
import userOptions from "../route/admin/user";
import { Level } from "../model/game/level";
import levelOptions from "../route/admin/level";
import { Task } from "../model/game/task";
import categoryOptions from "../route/admin/category";
import { Category } from "../model/game/category";
import taskOptions from "../route/admin/task";
import { Admin } from "../model/admin/admin";
import { adminOptions } from "../route/admin/admin";
import { adminAuthenticationService } from "../service/admin";

AdminJS.registerAdapter(AdminJSMongoose);

const manageNavigation: ResourceOptions["navigation"] = {
  name: "Manage",
  icon: "",
};

const adminJs = new AdminJS({
  resources: [
    {
      resource: Admin,
      options: {
        navigation: manageNavigation,
        ...adminOptions,
      },
    },
    {
      resource: User,
      options: {
        navigation: manageNavigation,
        ...userOptions,
      },
    },
    {
      resource: Level,
      options: {
        navigation: manageNavigation,
        ...levelOptions,
      },
    },
    {
      resource: Category,
      options: {
        navigation: manageNavigation,
        ...categoryOptions,
      },
    },
    {
      resource: Task,
      options: {
        navigation: manageNavigation,
        ...taskOptions,
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
  adminJs.options.loginPath = `${options.route}/login`;
  adminJs.options.logoutPath = `${options.route}/logout`;
  return AdminJSExpress.buildAuthenticatedRouter(adminJs, {
    authenticate: async (email, password) => {
      try {
        return await adminAuthenticationService.login({ email, password });
      } catch (e) {
        return false;
      }
    },
    cookiePassword: ADMIN_SECRET,
  });
};
