import { z } from "zod";
import { AppError, isAppError } from "./errors";

export type ActionError = {
  code: string;
  fieldErrors?: Record<string, string[]>;
};

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ActionError };

export const actionSuccess = <T>(data: T): ActionResult<T> => ({ ok: true, data });

export const actionFailure = <T = never>(
  code: string,
  fieldErrors?: Record<string, string[]>,
): ActionResult<T> => ({
  ok: false,
  error: {
    code,
    ...(fieldErrors ? { fieldErrors } : {}),
  },
});

export const zodFailure = <T = never>(error: z.ZodError): ActionResult<T> =>
  actionFailure("VALIDATION_FAILED", error.flatten().fieldErrors as Record<string, string[]>);

export const appErrorFailure = <T = never>(error: unknown): ActionResult<T> => {
  if (isAppError(error)) {
    return actionFailure(error.code);
  }

  return actionFailure("INTERNAL_ERROR");
};

export const assertActionSuccess = <T>(result: ActionResult<T>): T => {
  if (!result.ok) {
    throw new AppError("INTERNAL_ERROR", `Action failed with code ${result.error.code}`);
  }

  return result.data;
};
