import { levelService } from "../../service/level";
import { ActionContext, ActionRequest, ResourceOptions } from "adminjs";
import { linkedListProperties } from "./utils/linkedlist";
import {
  buildValidator,
  Messages,
  buildResponse,
} from "./utils/functions";
import Joi from "joi";

const levelOptions: ResourceOptions = {
  properties: {
    ...linkedListProperties,
  },
  actions: {
    bulkDelete: {
      isAccessible: false,
    },
    new: {
      before: buildValidator({
        name: Joi.string().min(3).required(),
      }),
      handler: async (req: ActionRequest, res: any, con: ActionContext) => {
        const level = await levelService.create(req.payload);
        return buildResponse({
          con,
          result: "success",
          message: Messages.Created,
          record: { name: level.name, id: level._id, errors: {} },
        });
      },
    },
    delete: {
      handler: async (req: ActionRequest, res: any, con: ActionContext) => {
        const id = req.params.recordId;
        if (id && con.record) {
          await levelService.delete({ id });
          return buildResponse({
            con,
            result: "success",
            message: Messages.Deleted,
          });
        } else
          return buildResponse({
            con,
            result: "error",
            message: Messages.BadRequest,
          });
      },
    },
    edit: {
      before: buildValidator({
        name: Joi.string().min(3).required(),
      }),
    },
  },
};

export default levelOptions;
