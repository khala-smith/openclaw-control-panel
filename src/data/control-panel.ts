export type Metric = {
  label: string;
  value: string;
  footnote: string;
};

export type GatewaySummaryItem = {
  label: string;
  value: string;
};

export type QuickAction = {
  title: string;
  description: string;
  command: string;
};

export type GatewayCapability = {
  title: string;
  description: string;
  status: string;
};

export type NodeRecord = {
  name: string;
  role: string;
  region: string;
  heartbeat: string;
  load: string;
  status: string;
};

export type ConnectionRecord = {
  name: string;
  channel: string;
  latency: string;
  status: string;
};

export type ActivityRecord = {
  title: string;
  timestamp: string;
  detail: string;
  status: string;
};

export const gatewayMetrics: Metric[] = [
  {
    label: "Active Gateways",
    value: "03",
    footnote: "Primary, staging, and edge relay clusters online",
  },
  {
    label: "Managed Nodes",
    value: "18",
    footnote: "12 production nodes and 6 canary workers reporting",
  },
  {
    label: "Open Connections",
    value: "42",
    footnote: "Discord, Telegram, Slack, Matrix, and custom sockets",
  },
  {
    label: "Queued Automations",
    value: "09",
    footnote: "Deployment, failover, and credential rotation jobs scheduled",
  },
];

export const gatewaySummary: GatewaySummaryItem[] = [
  { label: "Gateway Version", value: "v0.9.0-alpha" },
  { label: "Config Revision", value: "2026.03.11-rc1" },
  { label: "Uptime", value: "16d 04h" },
  { label: "Sync Health", value: "99.98%" },
];

export const quickActions: QuickAction[] = [
  {
    title: "Open node provisioning",
    description: "Prepare a new worker template with environment validation.",
    command: "openclaw nodes provision --profile=edge",
  },
  {
    title: "Rotate shared gateway keys",
    description: "Regenerate credentials before promoting the next release train.",
    command: "openclaw gateway rotate-keys --scope=shared",
  },
  {
    title: "Inspect connection backlog",
    description: "Review events waiting for dispatch across external channels.",
    command: "openclaw connections backlog --top=25",
  },
];

export const gatewayCapabilities: GatewayCapability[] = [
  {
    title: "Gateway core",
    description: "Supervises multi-channel routing, retry policy, and failover.",
    status: "operational",
  },
  {
    title: "Node orchestration",
    description: "Coordinates worker enrollment, heartbeats, and workload balancing.",
    status: "degraded",
  },
  {
    title: "Connection broker",
    description: "Maintains live channel sessions and delivery acknowledgements.",
    status: "connected",
  },
  {
    title: "Audit trail",
    description: "Streams admin actions and runtime events into review storage.",
    status: "scheduled",
  },
];

export const nodeInventory: NodeRecord[] = [
  {
    name: "gateway-core-01",
    role: "Primary coordinator",
    region: "us-east-1",
    heartbeat: "12s ago",
    load: "63%",
    status: "healthy",
  },
  {
    name: "edge-router-02",
    role: "Channel ingress",
    region: "ap-southeast-1",
    heartbeat: "18s ago",
    load: "71%",
    status: "degraded",
  },
  {
    name: "inference-worker-07",
    role: "Agent execution",
    region: "eu-central-1",
    heartbeat: "9s ago",
    load: "46%",
    status: "synced",
  },
  {
    name: "recovery-agent-01",
    role: "Failover standby",
    region: "us-west-2",
    heartbeat: "46s ago",
    load: "12%",
    status: "idle",
  },
];

export const connectionInventory: ConnectionRecord[] = [
  {
    name: "discord-primary",
    channel: "Discord",
    latency: "122ms",
    status: "connected",
  },
  {
    name: "telegram-broker",
    channel: "Telegram",
    latency: "201ms",
    status: "throttled",
  },
  {
    name: "matrix-ops",
    channel: "Matrix",
    latency: "88ms",
    status: "connected",
  },
  {
    name: "slack-status",
    channel: "Slack",
    latency: "n/a",
    status: "pending",
  },
];

export const activityFeed: ActivityRecord[] = [
  {
    title: "Canary rollout paused",
    timestamp: "02:16 UTC",
    detail:
      "Node orchestration paused the edge-router deployment after elevated retry volume.",
    status: "warning",
  },
  {
    title: "Credential sync complete",
    timestamp: "01:43 UTC",
    detail:
      "Shared secrets finished propagating to the primary and staging gateway pools.",
    status: "healthy",
  },
  {
    title: "Inbound queue spike detected",
    timestamp: "00:58 UTC",
    detail:
      "Connection broker observed a short-lived surge on Telegram webhooks.",
    status: "warning",
  },
  {
    title: "Backup gateway verified",
    timestamp: "00:14 UTC",
    detail:
      "Failover path completed a health rehearsal and remained on standby.",
    status: "idle",
  },
];
