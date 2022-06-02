import {
  buildValidator,
  Messages,
  buildResponse,
  unflattenRequest,
  buildConditionalProperty,
} from "./utils/functions";
import Joi from "joi";
import { CustomJoi } from "../utils/custom_joi";
import { ActionContext, ActionRequest, ResourceOptions } from "adminjs";
import { categoryService } from "../../service/category";
import { NodeDiscriminators } from "../../model/game/node";
import AdminJS from "adminjs";
import { capitalize } from "underscore.string";

const baseNodeCreateJoi = {
  title: Joi.string().required(),
};

const taskOptions: ResourceOptions = {
  properties: {
    category: {
      type: "reference",
      reference: "Category",
      isRequired: true,
      isVisible: { edit: true, filter: false, list: false, show: false },
    },
    questionCount: {
      isVisible: { edit: false, filter: false, list: false, show: false },
    },
    nodes: {
      type: "mixed",
      isArray: true,
    },
    "nodes.type": {
      type: "string",
      availableValues: Object.keys(NodeDiscriminators).map((el) => ({
        value: el,
        label: capitalize(el),
      })),
    },
    "nodes.text": buildConditionalProperty({
      dependency: "nodes.$0.type",
      isin: ["text"],
      type: "string",
    }),
    "nodes.imageUrl": buildConditionalProperty({
      dependency: "nodes.$0.type",
      isin: ["image"],
      type: "string",
    }),
    "nodes.imageAlt": buildConditionalProperty({
      dependency: "nodes.$0.type",
      isin: ["image"],
      type: "string",
    }),
  },
  actions: {
    bulkDelete: {
      isAccessible: false,
    },
    new: {
      before: [
        unflattenRequest,
        buildValidator({
          name: Joi.string().required(),
          description: Joi.string().required(),
          nodes: Joi.array()
            .items(
              Joi.alternatives().try(
                Joi.object({
                  ...baseNodeCreateJoi,
                  type: Joi.string().required().valid("text"),
                  text: Joi.string().required(),
                }),
                Joi.object({
                  ...baseNodeCreateJoi,
                  type: Joi.string().required().valid("image"),
                  imageUrl: Joi.string().required(),
                  imageAlt: Joi.string().required(),
                })
              )
            )
            .min(1)
            .required(),
          questionNodes: Joi.array()
            .items(
              Joi.object({
                title: Joi.string().required(),
                question: Joi.string().required(),
              }).unknown(true)
            )
            .min(1)
            .required(),
          category: CustomJoi.ObjectId().required(),
        }),
      ],
      handler: async (req: ActionRequest, res: any, con: ActionContext) => {
        const task = await categoryService.addTask(req.payload as any);
        return buildResponse({
          con,
          result: "success",
          message: Messages.Created,
          record: { name: task.name, id: task._id, errors: {} },
        });
      },
    },
    delete: {
      handler: async (req: ActionRequest, res: any, con: ActionContext) => {
        /*const id = req.params.recordId;
        if (id && con.record) {
          await categoryService.deleteTask({ id });
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
          });*/
        return res;
      },
    },
    edit: {
      before: buildValidator({
        name: Joi.string().min(3).required(),
      }),
    },
  },
};

export default taskOptions;
