import {
  ActionContext,
  ActionRequest,
  ActionResponse,
  After,
  Before,
  PropertyOptions,
  PropertyType,
  RecordActionResponse,
  ValidationError,
} from "adminjs";
import Joi from "joi";
import { unflatten } from "flat";
import AdminJS from "adminjs";
import path from "path";
import fs from "fs";
import { InvalidExtensionError } from "../../../service/errors";
import { PROJECT_PATH } from "../../../pre-start/constants";

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
  record?: object;
}): ActionResponse {
  if (!record) record = con.record!.toJSON(con.currentAdmin);
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
    record: record,
  };
}

/**
 * Creates a handler that validates an ActionRequest using Joi
 */
export function buildValidator(
  schema: Joi.PartialSchemaMap
): (req: ActionRequest) => Promise<ActionRequest> {
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
}: {
  type: PropertyType;
  dependency: string;
  isin: string[];
}): PropertyOptions {
  return {
    components: {
      edit: bundleFromView("conditional_property"),
      show: bundleFromView("conditional_property"),
    },
    type,
    custom: {
      dependency,
      isin,
    },
  };
}

interface RequestFile {
  name: string;
  path: fs.PathLike;
}

/** Checks if an object is a file section from a request */
function isRequestFile(obj: any): boolean {
  return obj?.path && obj?.name;
}

/**
 * Saves a file with the record name
 */
export function buildFileUploadAfter({
  attribute,
  staticFolderEndpoint,
  staticFolderPath,
  subPath,
}: {
  /** db attribute for storing `subPath + fileName` */
  attribute: string;
  /** url subpath after domain to access public files */
  staticFolderEndpoint: string;
  /** path to the folder containing the files */
  staticFolderPath: string;
  /** subpath to store the file. it is physically located in `staticFolder` */
  subPath: string;
}) {
  const hook: After<any> = async (
    res: ActionResponse,
    _req: ActionRequest,
    con: ActionContext
  ) => {
    const { record } = con;
    const file: RequestFile | undefined = con[`upload_${attribute}`];

    if (record?.isValid() && file && isRequestFile(file)) {
      const extension = path.extname(file.name);
      const fileName = `${record.id().toString()}${extension}`;

      const diskPath = path.join(staticFolderPath, subPath, fileName);
      const staticPath = path.posix.join(
        staticFolderEndpoint,
        subPath,
        fileName
      );

      await fs.promises.rename(file.path, diskPath);
      await record.update({ [attribute]: staticPath });
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
export function buildFileUploadBefore({
  attribute,
  extensions,
}: {
  /** db attribute for storing `subPath + fileName` */
  attribute: string;
  /** array of file extensions. example: `['png', 'jpg']` */
  extensions: string[];
}): Before {
  const validExtensions = new Set(extensions.map((el) => `.${el}`));
  const hook: Before = async (req: ActionRequest, con: ActionContext) => {
    if (req.method === "post") {
      let validParams = req.payload;

      const file: RequestFile | undefined = validParams?.[attribute];
      if (file && isRequestFile(file)) {
        const extension = path.extname(file.name);
        if (validExtensions.has(extension)) {
          con[`upload_${attribute}`] = file;
          validParams![attribute] = UploadFlags.waiting;
        } else validParams![attribute] = UploadFlags.invalid;
      }

      return {
        ...req,
        payload: validParams,
      };
    }
    return req;
  };
  return hook;
}

export function buildDeleteFileAfter({
  attribute,
  staticFolderPath,
  staticFolderEndpoint,
}: {
  /** db attribute for storing `subPath + fileName` */
  attribute: string;
  /** url subpath after domain to access public files */
  staticFolderPath: string;
  /** url subpath after domain to access public files */
  staticFolderEndpoint: string;
}) {
  const hook: After<ActionResponse> = async (res, _req, con) => {
    const fileEndpoint: string = con?.record?.params?.[attribute];
    if (fileEndpoint) {
      const fileSuffix = fileEndpoint.split(staticFolderEndpoint)[1];
      const filePath = path.join(staticFolderPath, fileSuffix);
      await fs.promises.rm(filePath);
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
    path.join(...[PROJECT_PATH, "src", "view", "admin", ...paths])
  );
}
