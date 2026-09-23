import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { StringListField } from "./string-list-field";

describe("StringListField", () => {
  it("adds a trimmed item on click and clears the input", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<StringListField id="signals" label="Signaux" value={[]} onChange={onChange} />);

    await user.type(screen.getByRole("textbox"), "  Budget annoncé  ");
    await user.click(screen.getByRole("button", { name: "Ajouter" }));

    expect(onChange).toHaveBeenCalledWith(["Budget annoncé"]);
  });

  it("adds an item on Enter without submitting a parent form", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<StringListField id="signals" label="Signaux" value={["a"]} onChange={onChange} />);

    await user.type(screen.getByRole("textbox"), "b{Enter}");

    expect(onChange).toHaveBeenCalledWith(["a", "b"]);
  });

  it("does not add a blank item", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<StringListField id="signals" label="Signaux" value={[]} onChange={onChange} />);

    await user.type(screen.getByRole("textbox"), "   ");
    await user.click(screen.getByRole("button", { name: "Ajouter" }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("removes an item by index", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<StringListField id="signals" label="Signaux" value={["a", "b"]} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Retirer « a »" }));

    expect(onChange).toHaveBeenCalledWith(["b"]);
  });
});
