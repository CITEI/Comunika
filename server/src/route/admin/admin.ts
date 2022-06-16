import { adminService } from "../../service/admin";
import {
  ActionContext,
  ActionRequest,
  ActionResponse,
  ResourceOptions,
} from "adminjs";
import Joi from "joi";
import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  ROOT_EMAIL,
} from "../../pre-start/constants";
import { CustomJoi } from "../utils/custom_joi";
import { buildResponse, buildValidator, Messages } from "./utils/functions";

export const adminOptions: ResourceOptions = {
  properties: {
    password: {
      isVisible: { filter: false, list: false, show: false, edit: true },
    },
    invitedBy: {
      isVisible: { filter: true, list: true, show: true, edit: false },
    },
  },
  actions: {
    new: {
      before: [
        async (
          req: ActionRequest,
          con: ActionContext
        ): Promise<ActionRequest> => {
          if (con.currentAdmin && req.payload)
            req.payload["invitedBy"] = con.currentAdmin._id;
          return req;
        },
        buildValidator({
          name: CustomJoi.RequiredString(),
          email: Joi.string().email().required(),
          password: Joi.string()
            .min(MIN_PASSWORD_LENGTH)
            .max(MAX_PASSWORD_LENGTH),
          invitedBy: CustomJoi.ObjectId().required(),
        }),
      ],
    },
    list: {
      after: async (res: ActionResponse): Promise<ActionResponse> => {
        // does not list root
        res.records = res.records.filter((el: any) => el.title != ROOT_EMAIL);
        return res;
      },
    },
    delete: {
      handler: async (
        req: ActionRequest,
        res: ActionResponse,
        con: ActionContext
      ): Promise<ActionResponse> => {
        try {
          if (req.params?.recordId && con.currentAdmin?._id) {
            await adminService.delete({
              id: req.params.recordId,
              admin: con.currentAdmin._id,
            });
            return buildResponse({
              con,
              result: "success",
              message: Messages.Deleted,
            });
          }
        } catch {}
        return buildResponse({
          con,
          result: "error",
          message: Messages.BadRequest,
        });
      },
    },
    bulkDelete: {
      isAccessible: false,
    },
    edit: {
      isAccessible: false,
    },
  },
};
