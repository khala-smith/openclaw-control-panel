import type { DashboardSnapshot } from "@/lib/stream";

export const fallbackSnapshot: DashboardSnapshot = {
  generatedAt: new Date().toISOString(),
  cluster: "openclaw-main",
  environment: "staging",
  uptime: "14d 07h",
  throughputPerMin: 1240,
  errorRate: 0.32,
  metrics: [
    { label: "Live gateways", value: "3", delta: "+0", trend: "flat" },
    { label: "Online workers", value: "19", delta: "+2", trend: "up" },
    { label: "Channel sessions", value: "47", delta: "+6", trend: "up" },
    { label: "Queued automations", value: "11", delta: "-1", trend: "down" },
  ],
  nodes: [
    {
      name: "gateway-core-01",
      role: "Primary coordinator",
      region: "us-east-1",
      load: 62,
      heartbeatSeconds: 8,
      status: "healthy",
    },
    {
      name: "edge-router-04",
      role: "Ingress relay",
      region: "ap-southeast-1",
      load: 74,
      heartbeatSeconds: 16,
      status: "degraded",
    },
    {
      name: "recovery-agent-02",
      role: "Failover standby",
      region: "eu-central-1",
      load: 22,
      heartbeatSeconds: 12,
      status: "idle",
    },
  ],
  connections: [
    { name: "discord-primary", channel: "Discord", latencyMs: 118, status: "connected" },
    { name: "telegram-broker", channel: "Telegram", latencyMs: 188, status: "throttled" },
    { name: "slack-status", channel: "Slack", latencyMs: 94, status: "connected" },
    { name: "matrix-ops", channel: "Matrix", latencyMs: 86, status: "connected" },
  ],
  activity: [
    {
      title: "Canary deploy resumed",
      detail: "Autoscaler added two workers to absorb webhook bursts.",
      timestamp: "03:06 UTC",
      status: "healthy",
    },
    {
      title: "Connection retry burst",
      detail: "Telegram backoff spiked for 46 seconds and then recovered.",
      timestamp: "02:58 UTC",
      status: "warning",
    },
    {
      title: "Key rotation scheduled",
      detail: "Shared gateway keys queued for non-disruptive rollout.",
      timestamp: "02:41 UTC",
      status: "idle",
    },
  ],
};
