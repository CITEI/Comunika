import AdminJS, { ResourceOptions, ResourceWithOptions } from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSMongoose from "@adminjs/mongoose";
import { ADMIN_SECRET, API_VERSION, APP_NAME, ORIGIN, STATIC_DIR } from "./constants";
import { User } from "../model/user";
import userOptions from "../route/admin/user";
import { Module } from "../model/module";
import moduleOptions from "../route/admin/module";
import { Activity } from "../model/activity";
import stageOptions from "../route/admin/stage";
import { Stage } from "../model/stage";
import activityOptions from "../route/admin/activity";
import { Admin } from "../model/admin";
import { Disability } from "../model/disability";
import { adminOptions } from "../route/admin/admin";
import { adminAuthenticationService } from "../service/admin";
import { join } from "path";

AdminJS.registerAdapter(AdminJSMongoose);

const gameNavigation: ResourceOptions["navigation"] = {
  name: "Game",
  icon: "",
};

const peopleNavigation: ResourceOptions["navigation"] = {
  name: "People",
  icon: "",
};

const adminJs = new AdminJS({
  resources: [
    {
      resource: Admin,
      options: {
        navigation: peopleNavigation,
        ...adminOptions,
      },
    },
    {
      resource: User,
      options: {
        navigation: peopleNavigation,
        ...userOptions,
      },
    },
    {
      resource: Disability,
      options: {
        navigation: peopleNavigation,
      },
    },
    {
      resource: Module,
      options: {
        navigation: gameNavigation,
        ...moduleOptions,
      },
    },
    {
      resource: Stage,
      options: {
        navigation: gameNavigation,
        ...stageOptions,
      },
    },
    {
      resource: Activity,
      options: {
        navigation: gameNavigation,
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
