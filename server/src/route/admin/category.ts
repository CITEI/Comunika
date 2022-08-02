import { categoryService } from "../../service/category";
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
import { PUBLIC_PATH } from "../../pre-start/constants";

const categoryOptions: ResourceOptions = {
  properties: {
    ...linkedListProperties,
    image: buildFileUploadProperty({ extensions: ["png"] }),
    activities: {
      isVisible: { edit: false, filter: false, list: true, show: true },
    },
  },
  actions: {
    bulkDelete: { isAccessible: false },
    new: {
      before: [
        buildFileUploadBefore([{ attribute: "image", extensions: ["png"] }]),
        buildValidator({
          name: CustomJoi.RequiredString(),
          description: CustomJoi.RequiredString(),
          image: CustomJoi.UploadStatus().required(),
          imageAlt: CustomJoi.RequiredString(),
          stage: CustomJoi.ObjectId().required(),
        }),
      ],
      after: [
        buildFileUploadAfter({
          image: {
            staticFolderEndpoint: "public",
            staticFolderPath: PUBLIC_PATH,
            subPath: "category",
          },
        }),
      ],
      handler: async (
        req: ActionRequest,
        _res: any,
        con: ActionContext
      ): Promise<ActionResponse> => {
        const category = await categoryService.create(req.payload as object);
        return buildResponse({
          con,
          result: "success",
          message: Messages.Created,
          record: category,
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
      handler: async (
        req: ActionRequest,
        _res: any,
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

categoryOptions!.actions!.edit = {
  before: categoryOptions.actions!.new!.before,
  after: categoryOptions.actions!.new!.after as After<RecordActionResponse>[],
};

export default categoryOptions;
