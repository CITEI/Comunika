import {
  buildValidator,
  Messages,
  buildResponse,
  unflattenRequest,
  buildConditionalProperty,
  buildFileUploadProperty,
  buildFileUploadBefore,
  buildFileUploadAfter,
  buildFileDeleteAfter,
} from "./utils/functions";
import Joi from "joi";
import { CustomJoi } from "../utils/custom_joi";
import { ActionContext, ActionRequest, ResourceOptions } from "adminjs";
import { NodeDiscriminators } from "../../model/node";
import { capitalize } from "underscore.string";
import { ActivitySchema } from "../../model/activity";
import { moduleService } from "../../service/module";
import {
  MIN_NODES,
  MIN_QUESTION_NODES,
  PUBLIC_PATH,
} from "../../pre-start/constants";

const baseNodeCreateSchema = {
  text: CustomJoi.RequiredString(),
};

/** Base validator input for Joi */
const activityValidatorSchema = {
  name: CustomJoi.RequiredString(),
  nodes: Joi.array()
    .items(
      Joi.alternatives().try(
        Joi.object({
          ...baseNodeCreateSchema,
          type: CustomJoi.RequiredString().valid("text"),
          image: CustomJoi.UploadStatus().required(),
          imageAlt: CustomJoi.RequiredString(),
          audio: CustomJoi.UploadStatus(),
          position: CustomJoi.RequiredString().valid('center', 'right', 'left')
        }),
        Joi.object({
          ...baseNodeCreateSchema,
          preview: Joi.bool().default(false),
          type: CustomJoi.RequiredString().valid("carrousel"),
          slides: Joi.array()
            .items(
              Joi.alternatives().try(
                Joi.object({
                  audio: CustomJoi.UploadStatus().required(),
                }),
                Joi.object({
                  image: CustomJoi.UploadStatus().required(),
                  imageAlt: CustomJoi.RequiredString(),
                }),
                Joi.object({
                  image: CustomJoi.UploadStatus().required(),
                  imageAlt: CustomJoi.RequiredString(),
                  audio: CustomJoi.UploadStatus().required(),
                })
              )
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
        question: CustomJoi.RequiredString(),
        notes: Joi.string().allow(""),
      })
    )
    .min(MIN_QUESTION_NODES)
    .required(),
};

const activityOptions: ResourceOptions = {
  properties: {
    module: {
      type: "reference",
      reference: "Module",
      isRequired: true,
      isVisible: { edit: true, filter: false, list: false, show: false },
    },
    alternative: {
      type: "boolean",
      isRequired: true,
      isVisible: { edit: true, filter: false, list: false, show: false },
    },
    questionCount: {
      isVisible: { edit: false, filter: false, list: false, show: true },
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
    "nodes.text": {
      type: "textarea",
    },
    "nodes.image": buildFileUploadProperty({
      dependency: "nodes.$.type",
      isin: ["text"],
      extensions: ["png", "svg", "gif"],
    }),
    "nodes.position": buildConditionalProperty({
      dependency: "nodes.$.type",
      isin: ['text'],
      type: 'string',
      availableValues: [{value: 'center', label: 'Centro'}, {value: 'right', label: 'Direita'}, {value: 'left', label: 'Esquerda'}]
    }),
    "nodes.imageAlt": buildConditionalProperty({
      dependency: "nodes.$.type",
      isin: ["text"],
      type: "string",
    }),
    "nodes.audio": buildFileUploadProperty({
      dependency: "nodes.$.type",
      isin: ["text"],
      extensions: ["ogg"],
    }),
    "nodes.preview": buildConditionalProperty({
      dependency: "nodes.$.type",
      isin: ["carrousel"],
      type: "boolean",
    }),
    "nodes.images": buildConditionalProperty({
      dependency: "nodes.$.type",
      isin: ["carrousel"],
      type: "mixed",
      isArray: true,
    }),
    "nodes.images.image": buildFileUploadProperty({
      dependency: "nodes.$.type",
      isin: ["carrousel"],
      extensions: ["png", "svg", "gif"],
    }),
    "nodes.images.imageAlt": buildConditionalProperty({
      dependency: "nodes.$.type",
      isin: ["carrousel"],
      type: "string",
    }),
    "nodes.images.audio": buildFileUploadProperty({
      dependency: "nodes.$.type",
      isin: ["carrousel"],
      extensions: ["ogg"],
    }),
  },
  actions: {
    bulkDelete: {
      isAccessible: false,
    },
    new: {
      before: [
        buildFileUploadBefore([
          { attribute: "nodes.$.image", extensions: ["png", "svg", "gif"] },
          { attribute: "nodes.$.audio", extensions: ["ogg"] },
          {
            attribute: "nodes.$.images.$.image",
            extensions: ["png", "svg", "gif"],
          },
          { attribute: "nodes.$.images.$.audio", extensions: ["ogg"] },
        ]),
        unflattenRequest,
        buildValidator({
          ...activityValidatorSchema,
          module: CustomJoi.ObjectId().required(),
          alternative: Joi.boolean().default(false),
        }),
      ],
      after: [
        buildFileUploadAfter({
          "nodes.$.image": {
            staticFolderEndpoint: "public",
            staticFolderPath: PUBLIC_PATH,
            subPath: "activity",
          },
          "nodes.$.audio": {
            staticFolderEndpoint: "public",
            staticFolderPath: PUBLIC_PATH,
            subPath: "activity",
          },
          "nodes.$.images.$.image": {
            staticFolderEndpoint: "public",
            staticFolderPath: PUBLIC_PATH,
            subPath: "activity",
          },
          "nodes.$.images.$.audio": {
            staticFolderEndpoint: "public",
            staticFolderPath: PUBLIC_PATH,
            subPath: "activity",
          },
        }),
      ],
      handler: async (req: ActionRequest, res: any, con: ActionContext) => {
        const activity = await moduleService.addActivity(req.payload as any);
        return buildResponse({
          con,
          result: "success",
          message: Messages.Created,
          record: activity,
        });
      },
    },
    delete: {
      after: buildFileDeleteAfter({
        "nodes.$.image": {
          staticFolderEndpoint: "public",
          staticFolderPath: PUBLIC_PATH,
        },
        "nodes.$.audio": {
          staticFolderEndpoint: "public",
          staticFolderPath: PUBLIC_PATH,
        },
        "nodes.$.images.$.image": {
          staticFolderEndpoint: "public",
          staticFolderPath: PUBLIC_PATH,
        },
        "nodes.$.images.$.audio": {
          staticFolderEndpoint: "public",
          staticFolderPath: PUBLIC_PATH,
        },
      }),
      handler: async (req: ActionRequest, res: any, con: ActionContext) => {
        const id = req.params.recordId;
        if (id && con.record) {
          await moduleService.deleteActivity({ activity: id });
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
      before: [
        (request) => {
          const regex = /(questionNodes\.[0-9]+\.question)/ 

          if (request.payload) {
            const numberOfQuestions = Object.entries(request.payload!).filter((value, _) => regex.test(value[0])).length;
            request.payload.questionCount = numberOfQuestions;
          }

          return request;
        },
        buildFileUploadBefore([
          { attribute: "nodes.$.image", extensions: ["png", "svg", "gif"] },
          { attribute: "nodes.$.audio", extensions: ["ogg"] },
          {
            attribute: "nodes.$.images.$.image",
            extensions: ["png", "svg", "gif"],
          },
          { attribute: "nodes.$.images.$.audio", extensions: ["ogg"] },
        ]),
        unflattenRequest,
        buildValidator({
          ...activityValidatorSchema,
        }),
      ],
      layout: Object.keys(ActivitySchema.paths).filter(
        (key) => !["_id", "__v", "questionCount"].includes(key)
      ),
      after: [
        buildFileUploadAfter({
          "nodes.$.image": {
            staticFolderEndpoint: "public",
            staticFolderPath: PUBLIC_PATH,
            subPath: "activity",
          },
          "nodes.$.audio": {
            staticFolderEndpoint: "public",
            staticFolderPath: PUBLIC_PATH,
            subPath: "activity",
          },
          "nodes.$.images.$.image": {
            staticFolderEndpoint: "public",
            staticFolderPath: PUBLIC_PATH,
            subPath: "activity",
          },
          "nodes.$.images.$.audio": {
            staticFolderEndpoint: "public",
            staticFolderPath: PUBLIC_PATH,
            subPath: "activity",
          },
        }),
      ],
    },
  },
};

export default activityOptions;
