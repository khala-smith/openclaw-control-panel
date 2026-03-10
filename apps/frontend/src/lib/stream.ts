export type StreamTrend = "up" | "down" | "flat";

export type DashboardMetric = {
  label: string;
  value: string;
  delta: string;
  trend: StreamTrend;
};

export type DashboardNode = {
  name: string;
  role: string;
  region: string;
  load: number;
  heartbeatSeconds: number;
  status: string;
};

export type DashboardConnection = {
  name: string;
  channel: string;
  latencyMs: number;
  status: string;
};

export type DashboardActivity = {
  title: string;
  detail: string;
  timestamp: string;
  status: string;
};

export type DashboardSnapshot = {
  generatedAt: string;
  cluster: string;
  environment: string;
  uptime: string;
  throughputPerMin: number;
  errorRate: number;
  metrics: DashboardMetric[];
  nodes: DashboardNode[];
  connections: DashboardConnection[];
  activity: DashboardActivity[];
};

type StreamEnvelope = {
  type: "snapshot";
  payload: DashboardSnapshot;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function isSnapshot(value: unknown): value is DashboardSnapshot {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.generatedAt === "string" &&
    typeof value.cluster === "string" &&
    typeof value.environment === "string" &&
    typeof value.uptime === "string" &&
    typeof value.throughputPerMin === "number" &&
    typeof value.errorRate === "number" &&
    Array.isArray(value.metrics) &&
    Array.isArray(value.nodes) &&
    Array.isArray(value.connections) &&
    Array.isArray(value.activity)
  );
}

export function parseStreamMessage(input: unknown): DashboardSnapshot | null {
  let decoded = input;

  if (typeof input === "string") {
    try {
      decoded = JSON.parse(input) as unknown;
    } catch {
      return null;
    }
  }

  if (isSnapshot(decoded)) {
    return decoded;
  }

  if (!isRecord(decoded) || decoded.type !== "snapshot" || !isRecord(decoded.payload)) {
    return null;
  }

  const envelope = decoded as StreamEnvelope;

  return isSnapshot(envelope.payload) ? envelope.payload : null;
}
