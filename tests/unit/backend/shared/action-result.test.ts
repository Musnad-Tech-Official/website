import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  actionFailure,
  actionSuccess,
  zodFailure,
} from "@/lib/backend/shared/action-result";

describe("ActionResult", () => {
  it("creates a success result", () => {
    expect(actionSuccess({ id: "profile-1" })).toEqual({
      ok: true,
      data: { id: "profile-1" },
    });
  });

  it("creates a stable error code", () => {
    expect(actionFailure("FORBIDDEN")).toEqual({
      ok: false,
      error: { code: "FORBIDDEN" },
    });
  });

  it("normalizes Zod field errors", () => {
    const schema = z.object({ name: z.string().min(2) });
    const parsed = schema.safeParse({ name: "" });

    expect(parsed.success).toBe(false);
    if (parsed.success) return;

    const result = zodFailure(parsed.error);
    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.error.code).toBe("VALIDATION_FAILED");
    expect(result.error.fieldErrors?.name?.length).toBeGreaterThan(0);
  });
});
