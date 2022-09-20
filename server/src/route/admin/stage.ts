import { stageService } from "../../service/stage";
import {
  ActionContext,
  ActionRequest,
  ActionResponse,
  After,
  RecordActionResponse,
  ResourceOptions,
} from "adminjs";
import { linkedListProperties } from "./utils/linkedlist";
import {
  buildFileDeleteAfter,
  buildFileUploadAfter,
  buildFileUploadBefore,
  buildFileUploadProperty,
  buildResponse,
  buildValidator,
  Messages,
} from "./utils/functions";
import { CustomJoi } from "../utils/custom_joi";
import { PUBLIC_PATH, STATIC_DIR } from "../../pre-start/constants";

const stageOptions: ResourceOptions = {
  properties: {
    ...linkedListProperties,
    activities: {
      isVisible: { edit: true, filter: false, list: true, show: true },
    },
    alternativeActivities: {
      isVisible: { edit: true, filter: false, list: true, show: true },
    },
    image: buildFileUploadProperty({ extensions: ["png"] }),
  },
  actions: {
    bulkDelete: { isAccessible: false },
    new: {
      before: [
        buildFileUploadBefore([
          {
            attribute: "image",
            extensions: ["png"],
          },
        ]),
        buildValidator({
          name: CustomJoi.RequiredString(),
          module: CustomJoi.ObjectId().required(),
          image: CustomJoi.UploadStatus().required(),
          imageAlt: CustomJoi.RequiredString(),
        }),
      ],
      after: [
        buildFileUploadAfter({
          image: {
            staticFolderEndpoint: STATIC_DIR,
            staticFolderPath: PUBLIC_PATH,
            subPath: "stage",
          },
        }),
      ],
      handler: async (
        req: ActionRequest,
        _res: any,
        con: ActionContext
      ): Promise<ActionResponse> => {
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
      after: [
        buildFileDeleteAfter({
          image: {
            staticFolderEndpoint: STATIC_DIR,
            staticFolderPath: PUBLIC_PATH,
          },
        }),
      ],
      handler: async (
        req: ActionRequest,
        _res: any,
        con: ActionContext
      ): Promise<ActionResponse> => {
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
