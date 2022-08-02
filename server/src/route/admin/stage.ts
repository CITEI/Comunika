import { stageService } from "../../service/stage";
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
import { PUBLIC_PATH } from "../../pre-start/constants";

const stageOptions: ResourceOptions = {
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
          description: CustomJoi.RequiredString(),
          image: CustomJoi.UploadStatus(),
          imageAlt: CustomJoi.RequiredString(),
        }),
      ],
      after: [
        buildFileUploadAfter({
          image: {
            staticFolderEndpoint: "public",
            staticFolderPath: PUBLIC_PATH,
            subPath: "stage",
          },
        }),
      ],
      handler: async (req: ActionRequest, _res: any, con: ActionContext) => {
        const stage = await stageService.create(req.payload as object);
        return buildResponse({
          con,
          result: "success",
          message: Messages.Created,
          record: stage,
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
          await stageService.delete({ id });
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

stageOptions!.actions!.edit = {
  before: stageOptions.actions!.new!.before,
  after: stageOptions.actions!.new!.after as After<RecordActionResponse>[],
};

export default stageOptions;
