import {
  type ActivityRecord,
  type ConnectionRecord,
  type GatewayCapability,
  type GatewaySummaryItem,
  type Metric,
  type NodeRecord,
  type QuickAction,
  gatewayCapabilities,
} from "@/data/control-panel";

import { StatusChip } from "./status-chip";

type DashboardShellProps = {
  activityFeed: ActivityRecord[];
  connectionInventory: ConnectionRecord[];
  gatewayMetrics: Metric[];
  gatewaySummary: GatewaySummaryItem[];
  nodeInventory: NodeRecord[];
  quickActions: QuickAction[];
};

export function DashboardShell({
  activityFeed,
  connectionInventory,
  gatewayMetrics,
  gatewaySummary,
  nodeInventory,
  quickActions,
}: DashboardShellProps) {
  return (
    <main className="app-shell">
      <div className="dashboard">
        <section className="hero panel-card">
          <div className="hero-copy">
            <span className="eyebrow">OpenClaw gateway operations</span>
            <h1>Control every gateway, node, and channel from one surface.</h1>
            <p>
              This bootstrap establishes the dashboard foundation for the
              OpenClaw control plane: gateway health, node inventory,
              connection status, and the operations activity stream are all
              represented with reusable, typed UI building blocks.
            </p>
            <div className="hero-actions">
              <a className="button-primary" href="#gateway-overview">
                Review system health
              </a>
              <a className="button-secondary" href="#activity-feed">
                Inspect recent activity
              </a>
            </div>
          </div>
          <aside className="hero-panel">
            <h2>Deployment snapshot</h2>
            <dl className="summary-list">
              {gatewaySummary.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </section>

        <section className="metrics-grid" aria-label="Gateway metrics">
          {gatewayMetrics.map((metric) => (
            <article className="panel-card metric-card" key={metric.label}>
              <p className="metric-label">{metric.label}</p>
              <p className="metric-value">{metric.value}</p>
              <p className="metric-footnote">{metric.footnote}</p>
            </article>
          ))}
        </section>

        <section className="split-grid">
          <SectionCard
            id="gateway-overview"
            eyebrow="Core services"
            title="Gateway overview"
            subtitle="Seeded modules that the future control panel can connect to real APIs."
          >
            <div className="gateway-list">
              {gatewayCapabilities.map((capability) => (
                <CapabilityCard key={capability.title} capability={capability} />
              ))}
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Operator tools"
            title="Quick actions"
            subtitle="Command-line entry points surfaced for the first admin workflows."
          >
            <div className="action-list">
              {quickActions.map((action) => (
                <article className="action-item" key={action.title}>
                  <div className="action-copy">
                    <strong>{action.title}</strong>
                    <p>{action.description}</p>
                  </div>
                  <div>
                    <code>{action.command}</code>
                  </div>
                </article>
              ))}
            </div>
          </SectionCard>
        </section>

        <section className="split-grid">
          <SectionCard
            eyebrow="Managed capacity"
            title="Node inventory"
            subtitle="Initial typed records for coordinator, edge, and recovery workers."
          >
            <div className="node-list">
              {nodeInventory.map((node) => (
                <article className="node-item" key={node.name}>
                  <div>
                    <strong>{node.name}</strong>
                    <p className="node-caption">
                      {node.role} in {node.region}
                    </p>
                    <div className="node-metrics">
                      <span className="meta-pill">Heartbeat {node.heartbeat}</span>
                      <span className="meta-pill">Load {node.load}</span>
                    </div>
                  </div>
                  <StatusChip status={node.status} />
                </article>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            eyebrow="Channel broker"
            title="Connections"
            subtitle="External channel sessions and delivery pipeline state."
          >
            <div className="connection-list">
              {connectionInventory.map((connection) => (
                <article className="connection-item" key={connection.name}>
                  <div>
                    <strong>{connection.name}</strong>
                    <p className="connection-meta">
                      {connection.channel} · latency {connection.latency}
                    </p>
                  </div>
                  <StatusChip status={connection.status} />
                </article>
              ))}
            </div>
          </SectionCard>
        </section>

        <section>
          <SectionCard
            id="activity-feed"
            eyebrow="Event stream"
            title="Recent activity"
            subtitle="Operational events that matter during gateway management and incident response."
          >
            <div className="activity-list">
              {activityFeed.map((event) => (
                <article
                  className="activity-item"
                  key={`${event.title}-${event.timestamp}`}
                >
                  <div>
                    <strong>{event.title}</strong>
                    <p>{event.detail}</p>
                  </div>
                  <div>
                    <p className="activity-meta">{event.timestamp}</p>
                    <StatusChip status={event.status} />
                  </div>
                </article>
              ))}
            </div>
          </SectionCard>
        </section>

        <p className="footer-note">
          Bootstrap scope: static dashboard shell, typed seed data, reusable
          status formatting, and verification scripts.
        </p>
      </div>
    </main>
  );
}

type SectionCardProps = {
  children: React.ReactNode;
  eyebrow: string;
  id?: string;
  subtitle: string;
  title: string;
};

function SectionCard({
  children,
  eyebrow,
  id,
  subtitle,
  title,
}: SectionCardProps) {
  return (
    <section className="panel-card section-card" id={id}>
      <header className="section-header">
        <div>
          <h2 className="section-title">
            <small>{eyebrow}</small>
            {title}
          </h2>
          <p className="section-subtitle">{subtitle}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

function CapabilityCard({
  capability,
}: {
  capability: GatewayCapability;
}) {
  return (
    <article className="gateway-item">
      <StatusChip status={capability.status} />
      <strong>{capability.title}</strong>
      <p>{capability.description}</p>
    </article>
  );
}
