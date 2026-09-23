import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ValidationErrorBanner } from "./validation-error-banner";

describe("ValidationErrorBanner", () => {
  it("shows a generic message when no errors are given", () => {
    render(<ValidationErrorBanner />);
    expect(screen.getByText(/Corrigez les champs signalés/)).toBeInTheDocument();
  });

  it("lists every failing path with its message, humanized", () => {
    render(
      <ValidationErrorBanner
        errors={{ profileName: "Too small", "companyFit.employeeRange.min": "Invalid" }}
      />,
    );
    expect(screen.getByText(/profile name/)).toBeInTheDocument();
    expect(screen.getByText(/Too small/)).toBeInTheDocument();
    expect(screen.getByText(/company fit › employee range › min/)).toBeInTheDocument();
  });
});
