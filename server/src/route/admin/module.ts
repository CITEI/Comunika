import { moduleService } from "../../service/module";
import {
  ActionContext,
  ActionRequest,
  After,
  BaseRecord,
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
  buildFileDeleteAfter,
  buildFileUploadProperty,
} from "./utils/functions";
import { CustomJoi } from "../utils/custom_joi";
import { PUBLIC_PATH, STATIC_DIR } from "../../pre-start/constants";

const moduleOptions: ResourceOptions = {
  properties: {
    ...linkedListProperties,
    image: buildFileUploadProperty({ extensions: ["png"] }),
  },
  actions: {
    bulkDelete: {
      isAccessible: false,
    },
    new: {
      before: [
        buildFileUploadBefore([{ attribute: "image", extensions: ["png"] }]),
        buildValidator({
          name: CustomJoi.RequiredString(),
          image: CustomJoi.UploadStatus(),
          imageAlt: CustomJoi.RequiredString(),
        }),
      ],
      after: [
        buildFileUploadAfter({
          image: {
            staticFolderEndpoint: STATIC_DIR,
            staticFolderPath: PUBLIC_PATH,
            subPath: "module",
          },
        }),
      ],
      handler: async (req: ActionRequest, _res: any, con: ActionContext) => {
        let module = await moduleService.create(req.payload as object);
        module.previous = module.previous._id;
        return buildResponse({
          con,
          result: "success",
          message: Messages.Created,
          record: module,
        });
      },
    },
    delete: {
      after: buildFileDeleteAfter({
        image: {
          staticFolderEndpoint: "public",
          staticFolderPath: PUBLIC_PATH,
        },
      }),
      handler: async (req: ActionRequest, _res: any, con: ActionContext) => {
        const id = req.params.recordId;
        if (id && con.record) {
          await moduleService.delete({ id });
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

moduleOptions!.actions!.edit = {
  before: moduleOptions.actions!.new!.before,
  after: moduleOptions.actions!.new!.after as After<RecordActionResponse>[],
};

export default moduleOptions;
