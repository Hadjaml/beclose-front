import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionErrorsNote } from "./section-errors-note";

describe("SectionErrorsNote", () => {
  it("renders nothing when no error matches the prefix", () => {
    const { container } = render(
      <SectionErrorsNote errors={{ other: "bad" }} prefix="companyFit" />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows a matching nested error relative to the prefix", () => {
    render(
      <SectionErrorsNote
        errors={{ "companyFit.employeeRange.min": "Too small" }}
        prefix="companyFit"
      />,
    );
    expect(screen.getByText(/Too small/)).toBeInTheDocument();
    expect(screen.getByText(/employee range/)).toBeInTheDocument();
  });

  it("shows an error on the prefix itself without a relative label", () => {
    render(<SectionErrorsNote errors={{ companyFit: "Invalid" }} prefix="companyFit" />);
    expect(screen.getByText("Invalid")).toBeInTheDocument();
  });
});
