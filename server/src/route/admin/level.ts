import { levelService } from "../../service/level";
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
  buildDeleteFileAfter,
  buildFileUploadProperty,
} from "./utils/functions";
import { CustomJoi } from "../utils/custom_joi";
import { PUBLIC_PATH } from "../../pre-start/constants";

const levelOptions: ResourceOptions = {
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
        buildFileUploadBefore({ attribute: "image", extensions: ["png"] }),
        buildValidator({
          name: CustomJoi.RequiredString(),
          description: CustomJoi.RequiredString(),
          image: CustomJoi.UploadStatus(),
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
        return buildResponse({
          con,
          result: "success",
          message: Messages.Created,
          record: level,
        });
      },
    },
    delete: {
      after: buildDeleteFileAfter({
        attribute: "image",
        staticFolderEndpoint: "public",
        staticFolderPath: PUBLIC_PATH,
      }),
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
    },
  },
};

levelOptions!.actions!.edit = {
  before: levelOptions.actions!.new!.before,
  after: levelOptions.actions!.new!.after as After<RecordActionResponse>[],
};

export default levelOptions;
