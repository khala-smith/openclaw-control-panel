export type StatusTone = "healthy" | "warning" | "critical" | "idle";

const statusToneMap: Record<string, StatusTone> = {
  operational: "healthy",
  healthy: "healthy",
  connected: "healthy",
  synced: "healthy",
  live: "healthy",
  degraded: "warning",
  pending: "warning",
  throttled: "warning",
  unstable: "warning",
  reconnecting: "warning",
  critical: "critical",
  blocked: "critical",
  failed: "critical",
  idle: "idle",
  paused: "idle",
  scheduled: "idle",
  offline: "idle",
  connecting: "idle",
};

export function getStatusTone(status: string): StatusTone {
  return statusToneMap[status.trim().toLowerCase()] ?? "idle";
}

export function formatStatusLabel(status: string): string {
  return status
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((segment) => segment[0]!.toUpperCase() + segment.slice(1).toLowerCase())
    .join(" ");
}
