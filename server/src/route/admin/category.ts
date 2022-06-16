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
  buildDeleteFileAfter,
  buildFileUploadAfter,
  buildFileUploadBefore,
  buildResponse,
  buildValidator,
  bundleFromView,
  Messages,
} from "./utils/functions";
import { CustomJoi } from "../utils/custom_joi";
import { PUBLIC_PATH } from "../../pre-start/constants";

const categoryOptions: ResourceOptions = {
  properties: {
    ...linkedListProperties,
    image: {
      components: {
        edit: bundleFromView("upload_image_edit"),
        list: bundleFromView("upload_image_list"),
        show: bundleFromView("upload_image_list"),
      },
      custom: {
        extensions: ["png"],
      },
      isVisible: { filter: false, show: true, edit: true, list: true },
    },
    tasks: {
      isVisible: { edit: false, filter: false, list: true, show: true },
    },
  },
  actions: {
    bulkDelete: { isAccessible: false },
    new: {
      before: [
        buildFileUploadBefore({ attribute: "image", extensions: ["png"] }),
        buildValidator({
          name: CustomJoi.RequiredString(),
          description: CustomJoi.RequiredString(),
          image: CustomJoi.UploadStatus().required(),
          imageAlt: CustomJoi.RequiredString(),
          level: CustomJoi.ObjectId().required(),
        }),
      ],
      after: [
        buildFileUploadAfter({
          attribute: "image",
          staticFolderEndpoint: "public",
          staticFolderPath: PUBLIC_PATH,
          subPath: "category",
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
      after: buildDeleteFileAfter({
        attribute: "image",
        staticFolderEndpoint: "public",
        staticFolderPath: PUBLIC_PATH,
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
