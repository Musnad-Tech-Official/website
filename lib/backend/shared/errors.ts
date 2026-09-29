export type AppErrorCode =
  | "AUTH_REQUIRED"
  | "FORBIDDEN"
  | "VALIDATION_FAILED"
  | "NOT_FOUND"
  | "CONFLICT"
  | "PERSISTENCE_FAILED"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly cause?: unknown;

  constructor(code: AppErrorCode, message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.cause = options?.cause;
  }
}

export const isAppError = (value: unknown): value is AppError => value instanceof AppError;
