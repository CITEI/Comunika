import {
  ActionContext,
  ActionRequest,
  ActionResponse,
  PropertyOptions,
  PropertyType,
  ValidationError,
} from "adminjs";
import Joi from "joi";
import { unflatten } from "flat";
import AdminJS from "adminjs";

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
      edit: AdminJS.bundle("../../../view/admin/conditional_property"),
      show: AdminJS.bundle("../../../view/admin/conditional_property"),
    },
    type,
    custom: {
      dependency,
      isin,
    },
  };
}
