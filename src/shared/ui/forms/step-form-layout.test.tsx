import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { StepFormLayout } from "./step-form-layout";

function renderLayout(props: { isSubmitting?: boolean; onSubmit?: () => void }) {
  const onSubmit = props.onSubmit ?? vi.fn();
  render(
    <StepFormLayout
      title="Étape"
      description="Description"
      onBack={null}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      {...(props.isSubmitting === undefined ? {} : { isSubmitting: props.isSubmitting })}
    >
      <input aria-label="Champ" />
    </StepFormLayout>,
  );
  return onSubmit;
}

describe("StepFormLayout", () => {
  it("submits when idle", async () => {
    const onSubmit = renderLayout({});
    await userEvent.click(screen.getByRole("button", { name: "Continuer" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("disables the submit button and ignores submits while submitting (double click, Enter)", async () => {
    const onSubmit = renderLayout({ isSubmitting: true });
    const button = screen.getByRole("button", { name: "Continuer" });
    expect(button).toBeDisabled();

    await userEvent.click(button);
    await userEvent.type(screen.getByLabelText("Champ"), "{Enter}");

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
