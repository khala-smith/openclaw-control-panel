import { describe, expect, it } from "vitest";

import { formatStatusLabel, getStatusTone } from "./status";

describe("getStatusTone", () => {
  it("maps healthy states", () => {
    expect(getStatusTone("connected")).toBe("healthy");
    expect(getStatusTone("operational")).toBe("healthy");
  });

  it("maps warning states", () => {
    expect(getStatusTone("degraded")).toBe("warning");
    expect(getStatusTone(" pending ")).toBe("warning");
  });

  it("defaults to idle for unknown values", () => {
    expect(getStatusTone("queued")).toBe("idle");
  });
});

describe("formatStatusLabel", () => {
  it("normalizes separators and casing", () => {
    expect(formatStatusLabel("gateway_degraded")).toBe("Gateway Degraded");
    expect(formatStatusLabel("SYNCED")).toBe("Synced");
  });
});
