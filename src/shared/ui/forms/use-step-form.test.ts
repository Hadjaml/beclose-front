import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { useStepForm } from "./use-step-form";

const nestedSchema = z.object({
  name: z.string().trim().min(1),
  company: z.object({
    fit: z.object({ min: z.number().int() }),
  }),
  items: z.array(z.object({ key: z.string().trim().min(1) })),
});

describe("useStepForm", () => {
  it("keys a flat schema's errors by the field name alone", () => {
    const { result } = renderHook(() => useStepForm({ name: "" }, z.object({ name: z.string().trim().min(1) })));

    act(() => {
      result.current.validate();
    });

    expect(Object.keys(result.current.errors)).toEqual(["name"]);
  });

  it("keys a nested schema's errors by the full dot-joined path, not just the top-level field", () => {
    const { result } = renderHook(() =>
      useStepForm(
        { name: "x", company: { fit: { min: 0 } }, items: [{ key: "" }] },
        nestedSchema,
      ),
    );

    act(() => {
      result.current.validate();
    });

    // The real bug this generalizes from: a top-level-only key would have
    // collapsed this into "items", losing which item and which field
    // inside it actually failed.
    expect(result.current.errors["items.0.key"]).toBeDefined();
  });

  it("clears only the errors nested under the field being edited", () => {
    const { result } = renderHook(() =>
      useStepForm({ name: "", company: { fit: { min: 0 } }, items: [] }, nestedSchema),
    );

    act(() => {
      result.current.validate();
    });
    expect(result.current.errors["name"]).toBeDefined();

    act(() => {
      result.current.updateField("name", "Acme");
    });

    expect(result.current.errors["name"]).toBeUndefined();
  });

  it("returns the parsed data and clears all errors on a successful validate()", () => {
    const { result } = renderHook(() =>
      useStepForm(
        { name: "Acme", company: { fit: { min: 1 } }, items: [{ key: "a" }] },
        nestedSchema,
      ),
    );

    let parsed: unknown;
    act(() => {
      parsed = result.current.validate();
    });

    expect(parsed).toEqual({ name: "Acme", company: { fit: { min: 1 } }, items: [{ key: "a" }] });
    expect(result.current.errors).toEqual({});
  });
});
