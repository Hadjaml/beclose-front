import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EnumSelectField } from "./enum-select-field";

const options = [
  { value: "strong", label: "Fort" },
  { value: "weak", label: "Faible" },
] as const;

describe("EnumSelectField", () => {
  it("reports the selected option's value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <EnumSelectField id="need" label="Besoin" value={null} options={options} onChange={onChange} />,
    );

    await user.selectOptions(screen.getByLabelText("Besoin"), "weak");

    expect(onChange).toHaveBeenCalledWith("weak");
  });

  it("shows the current value as selected", () => {
    render(
      <EnumSelectField id="need" label="Besoin" value="strong" options={options} onChange={vi.fn()} />,
    );

    expect(screen.getByLabelText("Besoin")).toHaveValue("strong");
  });
});
