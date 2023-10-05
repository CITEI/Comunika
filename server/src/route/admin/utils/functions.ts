import {
  ActionContext,
  ActionRequest,
  ActionResponse,
  After,
  BaseRecord,
  Before,
  PropertyOptions,
  PropertyType,
  ValidationError,
} from "adminjs";
import Joi from "joi";
import { unflatten } from "flat";
import AdminJS from "adminjs";
import path from "path";
import fs from "fs";
import { v4 as uuid4 } from "uuid";
import { PROJECT_PATH } from "../../../pre-start/constants";
import mongoose from "mongoose";
import _ from "underscore";

export enum Messages {
  Created = "successfullyCreated",
  Deleted = "successfullyDeleted",
  ValidationError = "thereWereValidationErrors",
  BadRequest = "badRequest",
}

/**
 * Creates a response that redirects to main resource page
 */
export function redirectToResource(
  con: ActionContext,
  res: ActionResponse
): ActionResponse {
  return {
    ...res,
    redirectUrl: con.h.resourceUrl({ resourceId: con.resource.id() }),
  };
}

/**
 * Redirects an action back to the main resource page
 */
export function buildResponse({
  con,
  result,
  message,
  record,
}: {
  con: ActionContext;
  result: "success" | "error";
  message: Messages;
  record?: mongoose.Document;
}): ActionResponse {
  let res_record;
  if (!record) res_record = con.record!.toJSON(con.currentAdmin);
  else {
    res_record = new BaseRecord(record.toObject(), con.resource);
    con.record = res_record;
  }
  return {
    redirectUrl: con.h.resourceUrl({ resourceId: con.resource.id() }),
    notice:
      result == "success"
        ? {
            type: "success",
            message: con.translateMessage(message, con.resource.id()),
          }
        : {
            type: "error",
            message: con.translateMessage(
              "thereWereValidationErrors",
              con.resource.id()
            ),
          },
    record: res_record,
  };
}

/**
 * Creates a handler that validates an ActionRequest using Joi
 */
export function buildValidator(schema: Joi.PartialSchemaMap): Before {
  const validator = Joi.object(schema);
  return async (req: ActionRequest) => {
    if (req.method == "post") {
      const { error, value } = validator.validate(
        {
          ...req.payload,
          ...req.params,
        },
        { allowUnknown: true }
      );
      if (error) throw new ValidationError({}, { message: error.message });
    }
    return req;
  };
}

/**
 * Unflattens a flattened request params and payload
 */
export async function unflattenRequest(
  req: ActionRequest
): Promise<ActionRequest> {
  req.params = unflatten(req.params);
  req.payload = unflatten(req.payload);
  return req;
}

/**
 * Creates a conditional property object for resource options property
 */
export function buildConditionalProperty({
  dependency,
  isin,
  type,
  isArray,
  availableValues
}: {
  type: PropertyType;
  dependency: string;
  isin: string[];
  isArray?: boolean;
  availableValues?: {value: string, label: string}[]
}): PropertyOptions {
  return {
    components: {
      edit: bundleFromView("conditional_property"),
      show: bundleFromView("conditional_property"),
    },
    type,
    availableValues: availableValues,
    custom: {
      dependency,
      isin,
    },
    isArray: isArray || false,
  };
}

interface RequestFile {
  name: string;
  path: fs.PathLike;
  type: string;
}

/** Checks if an object is a file section from a request */
function isRequestFile(obj: any): boolean {
  return obj?.path && obj?.name && obj?.type;
}

interface Upload {
  file: RequestFile;
  attribute: string;
  key: string;
}

type UploadActionContext = ActionContext & {
  uploads?: Upload[];
};

type UploadActionRequest = ActionRequest & {
  files?: { [key: string]: RequestFile };
};

/**
 * Saves a file with the record name
 */
export function buildFileUploadAfter(
  destinations: Record<
    string,
    {
      /** url subpath after domain to access public files */
      staticFolderEndpoint: string;
      /** path to the folder containing the files */
      staticFolderPath: string;
      /** subpath to store the file. it is physically located in `staticFolder` */
      subPath: string;
      /** identifier to match a tag passed in `buildFileUploadBefore` */
    }
  >
) {
  const hook: After<any> = async (
    res: ActionResponse,
    _req: ActionRequest,
    con: UploadActionContext
  ) => {
    const { record } = con;
    const uploads = con.uploads;

    if (uploads && record && record.isValid()) {
      for (const { file, key, attribute } of uploads) {
        const { staticFolderPath, staticFolderEndpoint, subPath } =
          destinations[attribute];
        const extension = path.extname(file.name);
        const fileName = `${uuid4()}${extension}`;
        const diskPath = path.join(staticFolderPath, subPath, fileName);
        const uriPath = path.posix.join(
          staticFolderEndpoint,
          subPath,
          fileName
        );
        await fs.promises.rename(file.path, diskPath);
        record.params[key] = uriPath;
      }
      await record.save();
    }

    return res;
  };
  return hook;
}

export enum UploadFlags {
  invalid = "invalid",
  waiting = "waiting",
}

/**
 * Moves a file from payload to files when uploading something
 */
export function buildFileUploadBefore(
  properties: Array<{
    /** path to record attribute e.g. text.image */
    attribute: string;
    /** array of file extensions. example: `['png', 'jpg']` */
    extensions: string[];
  }>
): Before {
  const regexps = properties.map(
    (el) => `^${el.attribute.replace(/[$]/g, "\\d+")}\$`
  );
  const hook: Before = async (
    req: UploadActionRequest,
    con: UploadActionContext
  ) => {
    if (req.method == "post") {
      con.uploads = [];
      const { payload, files } = req;

      if (payload && files) {
        for (const key of Object.keys(files)) {
          const index = regexps.findIndex((regex) =>
            new RegExp(regex).test(key)
          );
          if (index > -1) {
            const property = properties[index];
            const file = files[key];
            if (file && isRequestFile(file)) {
              const extension = path.extname(file.name).replace(".", "");
              if (property.extensions.includes(extension)) {
                delete files[key];
                con.uploads.push({
                  file: file,
                  attribute: property.attribute,
                  key: key,
                });
                payload[key] = UploadFlags.waiting;
              } else payload[key] = UploadFlags.invalid;
            }
          }
        }
      }
      return {
        ...req,
        payload: payload,
      };
    }
    return req;
  };
  return hook;
}

/**
 * Deletes related files when a record is deleted
 */
export function buildFileDeleteAfter(
  destinations: Record<
    string,
    {
      /** url subpath after domain to access public files */
      staticFolderPath: string;
      /** url subpath after domain to access public files */
      staticFolderEndpoint: string;
    }
  >
) {
  const hook: After<ActionResponse> = async (res, _req, con) => {
    if (con?.record?.params) {
      for (let key of Object.keys(con.record.params)) {
        const attribute = key.replace(/\.\d+\./g, ".$.");
        if (attribute in destinations) {
          const { staticFolderEndpoint, staticFolderPath } =
            destinations[attribute];
          const fileEndpoint: string = con.record.params[key];
          const fileSuffix = fileEndpoint.split(staticFolderEndpoint)[1];
          const filePath = path.join(staticFolderPath, fileSuffix);
          await fs.promises.rm(filePath);
        }
      }
    }
    return res;
  };
  return hook;
}

/**
 * Creates an AdminJS component bundle from view/admin folder
 */
export function bundleFromView(...paths: string[]): string {
  return AdminJS.bundle(
    path.join(...[PROJECT_PATH, "view", "admin", ...paths])
  );
}

/**
 * Creates a file upload property (dropzone of files)
 */
export function buildFileUploadProperty({
  extensions,
  dependency,
  isin,
}: {
  /** Used to hint allowed file extensions. example: ['png', 'jpg'] */
  extensions: string[];
  dependency?: string;
  isin?: string[];
}): PropertyOptions {
  return {
    components: {
      edit: bundleFromView("upload_edit"),
      list: bundleFromView("upload_list"),
      show: bundleFromView("upload_list"),
    },
    custom: {
      extensions,
      dependency,
      isin,
    },
    isVisible: { filter: false, show: true, edit: true, list: true },
  };
}
