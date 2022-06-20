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
import { capitalize } from "underscore.string";
import { TaskSchema } from "../../model/game/task";
import { MIN_NODES, MIN_QUESTION_NODES } from "../../pre-start/constants";

const baseNodeCreateSchema = {
  title: CustomJoi.RequiredString(),
};

/** Base validator input for Joi */
const taskValidatorSchema = {
  name: CustomJoi.RequiredString(),
  description: CustomJoi.RequiredString(),
  nodes: Joi.array()
    .items(
      Joi.alternatives().try(
        Joi.object({
          ...baseNodeCreateSchema,
          type: CustomJoi.RequiredString().valid("text"),
          text: CustomJoi.RequiredString(),
          image: CustomJoi.UploadStatus().required(),
          imageAlt: CustomJoi.RequiredString(),
        }),
        Joi.object({
          ...baseNodeCreateSchema,
          type: CustomJoi.RequiredString().valid("carrousel"),
          images: Joi.array()
            .items(
              Joi.object({
                image: CustomJoi.UploadStatus().required(),
                imageAlt: CustomJoi.RequiredString(),
              })
            )
            .min(1),
        }),
        Joi.object({
          ...baseNodeCreateSchema,
          type: CustomJoi.RequiredString().valid("audible_mosaic"),
          text: CustomJoi.RequiredString(),
          mosaic: Joi.array()
            .items(
              Joi.object({
                image: CustomJoi.UploadStatus().required(),
                imageAlt: CustomJoi.RequiredString(),
                audio: CustomJoi.UploadStatus().required(),
              })
            )
            .min(1),
        })
      )
    )
    .min(MIN_NODES)
    .required(),
  questionNodes: Joi.array()
    .items(
      Joi.object({
        title: CustomJoi.RequiredString(),
        question: CustomJoi.RequiredString(),
      })
    )
    .min(MIN_QUESTION_NODES)
    .required(),
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
        label: capitalize(el.split("_").join(" ")),
      })),
    },
    "nodes.text": buildConditionalProperty({
      dependency: "nodes.$0.type",
      isin: ["text", "audible_mosaic"],
      type: "string",
    }),
    "nodes.image": buildConditionalProperty({
      dependency: "nodes.$0.type",
      isin: ["text"],
      type: "string",
    }),
    "nodes.imageAlt": buildConditionalProperty({
      dependency: "nodes.$0.type",
      isin: ["text"],
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
          ...taskValidatorSchema,
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
        const id = req.params.recordId;
        if (id && con.record) {
          await categoryService.deleteTask({ task: id });
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
      before: [unflattenRequest, buildValidator(taskValidatorSchema)],
      layout: Object.keys(TaskSchema.paths).filter(
        (key) => !["_id", "__v", "questionCount"].includes(key)
      ),
    },
  },
};

export default taskOptions;
