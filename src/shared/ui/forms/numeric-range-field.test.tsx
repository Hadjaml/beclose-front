import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { NumericRangeField, type NumericRangeValue } from "./numeric-range-field";

const emptyValue: NumericRangeValue = { min: null, max: null, rejectBelow: null, rejectAbove: null };

/** `user.type` sends one keystroke at a time — a controlled input needs to
 * actually apply each `onChange` between keystrokes to accumulate multi-digit
 * input, otherwise every keystroke overwrites the last against the same
 * static `value` prop. */
function ControlledNumericRangeField({ onCommit }: { onCommit: (next: NumericRangeValue) => void }) {
  const [value, setValue] = useState(emptyValue);
  return (
    <NumericRangeField
      id="headcount"
      label="Effectif"
      value={value}
      onChange={(next) => {
        setValue(next);
        onCommit(next);
      }}
    />
  );
}

describe("NumericRangeField", () => {
  it("reports a min change without touching the rest of the value", async () => {
    const user = userEvent.setup();
    const onCommit = vi.fn();
    render(<ControlledNumericRangeField onCommit={onCommit} />);

    await user.type(screen.getByLabelText("Minimum"), "10");

    expect(onCommit).toHaveBeenLastCalledWith({ ...emptyValue, min: 10 });
  });

  it("does not render reject bounds unless showRejectBounds is set", () => {
    render(<NumericRangeField id="headcount" label="Effectif" value={emptyValue} onChange={vi.fn()} />);

    expect(screen.queryByLabelText("Rejeter en dessous de")).not.toBeInTheDocument();
  });

  it("renders and reports reject bounds when showRejectBounds is set", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <NumericRangeField
        id="headcount"
        label="Effectif"
        value={emptyValue}
        onChange={onChange}
        showRejectBounds
      />,
    );

    await user.type(screen.getByLabelText("Rejeter en dessous de"), "5");

    expect(onChange).toHaveBeenLastCalledWith({ ...emptyValue, rejectBelow: 5 });
  });

  it("clears a field back to null when emptied", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <NumericRangeField
        id="headcount"
        label="Effectif"
        value={{ ...emptyValue, min: 10 }}
        onChange={onChange}
      />,
    );

    await user.clear(screen.getByLabelText("Minimum"));

    expect(onChange).toHaveBeenLastCalledWith({ ...emptyValue, min: null });
  });
});
