import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// vitest.config.mts does not set `test.globals`, so Testing Library's own
// automatic afterEach-cleanup registration (which relies on a global
// `afterEach`) never runs. Without this, DOM nodes pile up across `it`
// blocks in the same file and queries like `getByTestId` start matching
// more than one element — surfaced by tests/integration/session-provider.test.tsx,
// which renders more than once per file.
afterEach(() => {
  cleanup();
});
