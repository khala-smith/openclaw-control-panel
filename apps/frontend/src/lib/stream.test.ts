import { describe, expect, it } from "vitest";

import { parseStreamMessage } from "./stream";

const snapshot = {
  generatedAt: "2026-03-11T00:00:00Z",
  cluster: "openclaw-main",
  environment: "staging",
  uptime: "10d 02h",
  throughputPerMin: 1200,
  errorRate: 0.22,
  metrics: [],
  nodes: [],
  connections: [],
  activity: [],
};

describe("parseStreamMessage", () => {
  it("accepts direct snapshot payloads", () => {
    expect(parseStreamMessage(snapshot)).toEqual(snapshot);
  });

  it("accepts envelope payloads", () => {
    const message = JSON.stringify({ type: "snapshot", payload: snapshot });

    expect(parseStreamMessage(message)).toEqual(snapshot);
  });

  it("rejects invalid payloads", () => {
    expect(parseStreamMessage("not json")).toBeNull();
    expect(parseStreamMessage(JSON.stringify({ type: "unknown" }))).toBeNull();
  });
});
