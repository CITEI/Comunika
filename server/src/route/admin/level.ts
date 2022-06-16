import { levelService } from "../../service/level";
import {
  ActionContext,
  ActionRequest,
  After,
  RecordActionResponse,
  ResourceOptions,
} from "adminjs";
import { linkedListProperties } from "./utils/linkedlist";
import {
  buildValidator,
  Messages,
  buildResponse,
  buildFileUploadBefore,
  buildFileUploadAfter,
  bundleFromView,
  buildDeleteFileAfter,
  UploadFlags,
} from "./utils/functions";
import { CustomJoi } from "../utils/custom_joi";
import { PUBLIC_PATH } from "../../pre-start/constants";
import Joi from "joi";

const levelOptions: ResourceOptions = {
  properties: {
    ...linkedListProperties,
    image: {
      components: {
        edit: bundleFromView("upload_image_edit"),
        list: bundleFromView("upload_image_list"),
        show: bundleFromView("upload_image_list"),
      },
      custom: {
        extensions: ['png']
      },
      isVisible: { filter: false, show: true, edit: true, list: true },
    },
  },
  actions: {
    bulkDelete: {
      isAccessible: false,
    },
    new: {
      before: [
        buildFileUploadBefore({ attribute: "image", extensions: ["png"] }),
        buildValidator({
          name: CustomJoi.RequiredString(),
          description: CustomJoi.RequiredString(),
          image: Joi.string().invalid(UploadFlags.invalid).required(),
          imageAlt: CustomJoi.RequiredString(),
        }),
      ],
      after: [
        buildFileUploadAfter({
          attribute: "image",
          staticFolderEndpoint: "public",
          staticFolderPath: PUBLIC_PATH,
          subPath: "level",
        }),
      ],
      handler: async (req: ActionRequest, _res: any, con: ActionContext) => {
        const level = await levelService.create(req.payload as object);
        con.record = (await con.resource.findOne(level.id)) || undefined;
        return buildResponse({
          con,
          result: "success",
          message: Messages.Created,
          record: { name: level.name, id: level._id, errors: {} },
        });
      },
    },
    delete: {
      handler: async (req: ActionRequest, _res: any, con: ActionContext) => {
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
      after: buildDeleteFileAfter({
        attribute: "image",
        staticFolderEndpoint: "public",
        staticFolderPath: PUBLIC_PATH,
      }),
    },
    edit: {},
  },
};

levelOptions!.actions!.edit = {
  before: levelOptions.actions!.new!.before,
  after: levelOptions.actions!.new!.after as After<RecordActionResponse>[],
};

export default levelOptions;
