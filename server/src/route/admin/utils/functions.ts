import {
  ActionContext,
  ActionRequest,
  ActionResponse,
  ValidationError,
} from "adminjs";
import Joi from "joi";

export enum Messages {
  Created = "successfullyCreated",
  Deleted = "successfullyDeleted",
  ValidationError = "thereWereValidationErrors",
  BadRequest = "badRequest",
}

/**
 * Redirects an action back to the main resource page
 */
export function redirectToResource({
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
  return async (req: ActionRequest) => {
    const { error, value } = Joi.object({
      ...schema,
    }).validate(
      {
        ...req.payload,
        ...req.params,
      },
      { allowUnknown: true }
    );
    if (error)
      throw new ValidationError(
        {},
        {
          message: error.message,
        }
      );
    return req;
  };
}
