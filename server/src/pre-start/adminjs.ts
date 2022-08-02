import AdminJS, { ResourceOptions, ResourceWithOptions } from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSMongoose from "@adminjs/mongoose";
import { ADMIN_SECRET, API_VERSION, APP_NAME, ORIGIN, STATIC_DIR } from "./constants";
import { User } from "../model/game/user";
import userOptions from "../route/admin/user";
import { Stage } from "../model/game/stage";
import stageOptions from "../route/admin/stage";
import { Activity } from "../model/game/activity";
import boxOptions from "../route/admin/box";
import { Box } from "../model/game/box";
import activityOptions from "../route/admin/activity";
import { Admin } from "../model/admin/admin";
import { adminOptions } from "../route/admin/admin";
import { adminAuthenticationService } from "../service/admin";
import { join } from "path";

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
      resource: Stage,
      options: {
        navigation: manageNavigation,
        ...stageOptions,
      },
    },
    {
      resource: Box,
      options: {
        navigation: manageNavigation,
        ...boxOptions,
      },
    },
    {
      resource: Activity,
      options: {
        navigation: manageNavigation,
        ...activityOptions,
      },
    },
  ] as Array<ResourceWithOptions>,
  branding: {
    companyName: APP_NAME,
    logo: new URL(join(STATIC_DIR, "logo.png"), ORIGIN).href,
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
