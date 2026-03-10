"use client";

import { StatusPill } from "@/components/status-pill";
import { useGatewayStream, type StreamState } from "@/hooks/useGatewayStream";
import type { DashboardNode, StreamTrend } from "@/lib/stream";

const streamStateStyle: Record<StreamState, string> = {
  live: "border-emerald-300 bg-emerald-100 text-emerald-800 animate-pulse-border",
  connecting: "border-slate-300 bg-slate-100 text-slate-700",
  reconnecting: "border-amber-300 bg-amber-100 text-amber-700",
  offline: "border-rose-300 bg-rose-100 text-rose-700",
};

const metricTrendStyle: Record<StreamTrend, string> = {
  up: "text-emerald-700",
  down: "text-amber-700",
  flat: "text-slate-600",
};

function loadBarTone(load: number): string {
  if (load >= 80) {
    return "bg-rose-500";
  }

  if (load >= 65) {
    return "bg-amber-500";
  }

  return "bg-emerald-500";
}

function heartbeatLabel(node: DashboardNode): string {
  return `${node.heartbeatSeconds}s ago`;
}

export function AdminDashboard() {
  const { snapshot, state, lastError, streamUrl } = useGatewayStream();

  return (
    <main className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(to_right,rgba(15,118,110,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,118,110,0.06)_1px,transparent_1px)] [background-size:80px_80px]" />
      <div className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-8 sm:py-10">
        <header className="glass-surface animate-rise rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-[var(--font-mono)] text-xs uppercase tracking-[0.2em] text-teal-700">
                KHA-10 control plane
              </p>
              <h1 className="mt-2 font-[var(--font-heading)] text-3xl leading-tight text-slate-900 sm:text-5xl">
                Realtime Gateway Admin Dashboard
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
                Live websocket telemetry from the Go backend updates gateway health,
                node utilization, channel latency, and incident activity without refresh.
              </p>
            </div>
            <div className="grid gap-3 text-sm sm:min-w-72">
              <div
                className={`inline-flex items-center justify-center rounded-full border px-4 py-2 font-semibold uppercase tracking-[0.1em] ${streamStateStyle[state]}`}
              >
                Stream {state}
              </div>
              <dl className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white/80 p-3">
                <div>
                  <dt className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.1em] text-slate-500">
                    Cluster
                  </dt>
                  <dd className="text-base font-semibold text-slate-900">{snapshot.cluster}</dd>
                </div>
                <div>
                  <dt className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.1em] text-slate-500">
                    Environment
                  </dt>
                  <dd className="text-base font-semibold text-slate-900">{snapshot.environment}</dd>
                </div>
                <div>
                  <dt className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.1em] text-slate-500">
                    Uptime
                  </dt>
                  <dd className="text-base font-semibold text-slate-900">{snapshot.uptime}</dd>
                </div>
                <div>
                  <dt className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.1em] text-slate-500">
                    Throughput
                  </dt>
                  <dd className="text-base font-semibold text-slate-900">
                    {snapshot.throughputPerMin.toLocaleString()}/min
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          {lastError ? (
            <p className="mt-4 rounded-xl border border-amber-300 bg-amber-100 px-4 py-2 text-sm text-amber-700">
              {lastError}
            </p>
          ) : null}
          <p className="mt-4 font-[var(--font-mono)] text-xs text-slate-500">{streamUrl}</p>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {snapshot.metrics.map((metric, index) => (
            <article
              className="glass-surface animate-rise rounded-2xl p-5"
              key={metric.label}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <p className="font-[var(--font-mono)] text-xs uppercase tracking-[0.14em] text-slate-500">
                {metric.label}
              </p>
              <p className="mt-3 text-4xl font-semibold text-slate-900">{metric.value}</p>
              <p className={`mt-2 text-sm font-semibold ${metricTrendStyle[metric.trend]}`}>
                {metric.delta}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-6 grid gap-4 xl:grid-cols-[1.25fr_1fr]">
          <article className="glass-surface animate-rise rounded-2xl p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-[var(--font-heading)] text-2xl text-slate-900">Node Inventory</h2>
              <span className="font-[var(--font-mono)] text-xs uppercase tracking-[0.1em] text-slate-500">
                {snapshot.nodes.length} workers
              </span>
            </div>
            <div className="space-y-4">
              {snapshot.nodes.map((node) => (
                <article
                  className="rounded-xl border border-slate-200 bg-white/85 p-4"
                  key={node.name}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{node.name}</h3>
                      <p className="text-sm text-slate-600">
                        {node.role} in {node.region}
                      </p>
                    </div>
                    <StatusPill status={node.status} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.08em] text-slate-500">
                    <span>Heartbeat {heartbeatLabel(node)}</span>
                    <span>Load {node.load}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full ${loadBarTone(node.load)}`}
                      style={{ width: `${node.load}%` }}
                    />
                  </div>
                </article>
              ))}
            </div>
          </article>

          <div className="grid gap-4">
            <article className="glass-surface animate-rise rounded-2xl p-5">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-[var(--font-heading)] text-2xl text-slate-900">Connections</h2>
                <p className="font-[var(--font-mono)] text-xs uppercase tracking-[0.1em] text-slate-500">
                  Error rate {snapshot.errorRate.toFixed(2)}%
                </p>
              </div>
              <div className="space-y-3">
                {snapshot.connections.map((connection) => (
                  <div
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white/80 px-3 py-2"
                    key={connection.name}
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{connection.name}</p>
                      <p className="text-xs text-slate-500">
                        {connection.channel} · {connection.latencyMs}ms
                      </p>
                    </div>
                    <StatusPill status={connection.status} />
                  </div>
                ))}
              </div>
            </article>

            <article className="glass-surface animate-rise rounded-2xl p-5">
              <h2 className="font-[var(--font-heading)] text-2xl text-slate-900">Activity Feed</h2>
              <div className="mt-4 space-y-3">
                {snapshot.activity.map((event) => (
                  <article
                    className="rounded-xl border border-slate-200 bg-white/80 p-3"
                    key={`${event.title}-${event.timestamp}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">{event.title}</h3>
                      <StatusPill status={event.status} />
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{event.detail}</p>
                    <p className="mt-2 font-[var(--font-mono)] text-xs uppercase tracking-[0.08em] text-slate-500">
                      {event.timestamp}
                    </p>
                  </article>
                ))}
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
