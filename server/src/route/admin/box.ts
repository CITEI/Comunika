import { boxService } from "../../service/box";
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

const boxOptions: ResourceOptions = {
  properties: {
    ...linkedListProperties,
    activities: {
      isVisible: { edit: false, filter: false, list: true, show: true },
    },
  },
  actions: {
    bulkDelete: { isAccessible: false },
    new: {
      before: [
        buildValidator({
          name: CustomJoi.RequiredString(),
          description: CustomJoi.RequiredString(),
          stage: CustomJoi.ObjectId().required(),
        }),
      ],
      handler: async (
        req: ActionRequest,
        _res: any,
        con: ActionContext
      ): Promise<ActionResponse> => {
        const box = await boxService.create(req.payload as object);
        return buildResponse({
          con,
          result: "success",
          message: Messages.Created,
          record: box,
        });
      },
    },
    delete: {
      handler: async (
        req: ActionRequest,
        _res: any,
        con: ActionContext
      ): Promise<ActionResponse> => {
        const id = req.params.recordId;
        if (id && con.record) {
          await boxService.delete({ id });
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

boxOptions!.actions!.edit = {
  before: boxOptions.actions!.new!.before,
  after: boxOptions.actions!.new!.after as After<RecordActionResponse>[],
};

export default boxOptions;
