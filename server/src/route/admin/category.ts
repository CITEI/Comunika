import { categoryService } from "../../service/category";
import {
  ActionContext,
  ActionRequest,
  ActionResponse,
  ResourceOptions,
} from "adminjs";
import { linkedListProperties } from "./utils/linkedlist";
import { buildResponse, buildValidator, Messages } from "./utils/functions";
import { Joi } from "celebrate";
import { CustomJoi } from "../utils/custom_joi";

const categoryOptions: ResourceOptions = {
  properties: {
    ...linkedListProperties,
    tasks: {
      isVisible: { edit: false, filter: false, list: true, show: true },
    },
  },
  actions: {
    bulkDelete: { isAccessible: false },
    new: {
      before: buildValidator({
        name: Joi.string().min(3).required(),
        description: Joi.string().min(3).required(),
        iconUrl: Joi.string().required(),
        level: CustomJoi.ObjectId().required(),
      }),
      handler: async (
        req: ActionRequest,
        res: any,
        con: ActionContext
      ): Promise<ActionResponse> => {
        const category = await categoryService.create(req.payload);
        return buildResponse({
          con,
          result: "success",
          message: Messages.Created,
          record: { id: category._id, errors: {} },
        });
      },
    },
    delete: {
      handler: async (
        req: ActionRequest,
        res: any,
        con: ActionContext
      ): Promise<ActionResponse> => {
        const id = req.params.recordId;
        if (id && con.record) {
          await categoryService.delete({ id });
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
  },
};

export default categoryOptions;
