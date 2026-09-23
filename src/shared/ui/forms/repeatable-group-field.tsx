"use client";

import type { ReactNode } from "react";
import { FieldFrame } from "./field-frame";

/**
 * Add/remove a list of structured items (not plain strings — see
 * `StringListField` for that) — built 2026-09-23 for the upcoming ICP
 * creation flow's nested repeatable groups (`prioritySectors` tiers, each
 * with its own `sectors` list). Generic over the item type: the caller
 * supplies `renderItem` for the fields of one item and `createItem` for a
 * fresh blank one, so this primitive carries no knowledge of what an item
 * actually contains.
 *
 * Uses index as the list key: items are plain data with no stable identity
 * of their own, and the list only ever grows/shrinks at arbitrary
 * positions via add/remove (no drag-reordering) — the same trade-off
 * `StringListField` makes.
 */
export interface RepeatableGroupFieldProps<Item> {
  id: string;
  label: string;
  value: readonly Item[];
  onChange: (next: Item[]) => void;
  renderItem: (item: Item, index: number, updateItem: (next: Item) => void) => ReactNode;
  createItem: () => Item;
  hint?: string | undefined;
  error?: string | undefined;
  optional?: boolean | undefined;
  addLabel?: string;
  removeLabel?: string;
  emptyLabel?: string;
}

export function RepeatableGroupField<Item>({
  id,
  label,
  value,
  onChange,
  renderItem,
  createItem,
  hint,
  error,
  optional,
  addLabel = "Ajouter",
  removeLabel = "Retirer",
  emptyLabel,
}: RepeatableGroupFieldProps<Item>) {
  function updateItem(index: number, next: Item) {
    onChange(value.map((item, itemIndex) => (itemIndex === index ? next : item)));
  }

  function removeItem(index: number) {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  }

  function addItem() {
    onChange([...value, createItem()]);
  }

  return (
    <FieldFrame id={id} label={label} hint={hint} error={error} optional={optional}>
      <div className="space-y-3">
        {value.length === 0 && emptyLabel !== undefined ? (
          <p className="text-sm text-text-tertiary">{emptyLabel}</p>
        ) : null}
        {value.map((item, index) => (
          <div key={index} className="rounded-app-lg border border-border bg-surface-muted/60 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-3">
                {renderItem(item, index, (next) => updateItem(index, next))}
              </div>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="shrink-0 text-sm font-medium text-text-tertiary hover:text-red-700"
              >
                {removeLabel}
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="rounded-app-md border border-border px-4 py-2.5 text-sm font-semibold text-text-secondary hover:bg-surface-muted hover:text-text-primary"
        >
          {addLabel}
        </button>
      </div>
    </FieldFrame>
  );
}
