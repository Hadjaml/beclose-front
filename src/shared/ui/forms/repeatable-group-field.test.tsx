import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RepeatableGroupField } from "./repeatable-group-field";

interface Tier {
  tier: number;
}

describe("RepeatableGroupField", () => {
  it("appends a fresh item from createItem", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RepeatableGroupField<Tier>
        id="tiers"
        label="Secteurs prioritaires"
        value={[{ tier: 1 }]}
        onChange={onChange}
        renderItem={(item) => <span>Tier {item.tier}</span>}
        createItem={() => ({ tier: 0 })}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Ajouter" }));

    expect(onChange).toHaveBeenCalledWith([{ tier: 1 }, { tier: 0 }]);
  });

  it("removes an item by index", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RepeatableGroupField<Tier>
        id="tiers"
        label="Secteurs prioritaires"
        value={[{ tier: 1 }, { tier: 2 }]}
        onChange={onChange}
        renderItem={(item) => <span>Tier {item.tier}</span>}
        createItem={() => ({ tier: 0 })}
      />,
    );

    await user.click(screen.getAllByRole("button", { name: "Retirer" })[0] as HTMLElement);

    expect(onChange).toHaveBeenCalledWith([{ tier: 2 }]);
  });

  it("updates one item in place via the renderItem update callback", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RepeatableGroupField<Tier>
        id="tiers"
        label="Secteurs prioritaires"
        value={[{ tier: 1 }]}
        onChange={onChange}
        renderItem={(item, _index, updateItem) => (
          <button type="button" onClick={() => updateItem({ tier: item.tier + 10 })}>
            Bump
          </button>
        )}
        createItem={() => ({ tier: 0 })}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Bump" }));

    expect(onChange).toHaveBeenCalledWith([{ tier: 11 }]);
  });

  it("shows the empty label when there are no items", () => {
    render(
      <RepeatableGroupField<Tier>
        id="tiers"
        label="Secteurs prioritaires"
        value={[]}
        onChange={vi.fn()}
        renderItem={(item) => <span>Tier {item.tier}</span>}
        createItem={() => ({ tier: 0 })}
        emptyLabel="Aucun secteur"
      />,
    );

    expect(screen.getByText("Aucun secteur")).toBeInTheDocument();
  });
});
