package telemetry

import (
	"fmt"
	"math/rand"
	"sync"
	"time"
)

type Generator struct {
	mu        sync.Mutex
	random    *rand.Rand
	startedAt time.Time
}

func NewGenerator(seed int64, startedAt time.Time) *Generator {
	if seed == 0 {
		seed = time.Now().UnixNano()
	}

	return &Generator{
		random:    rand.New(rand.NewSource(seed)),
		startedAt: startedAt,
	}
}

func (g *Generator) Snapshot(now time.Time) Snapshot {
	g.mu.Lock()
	defer g.mu.Unlock()

	workers := 16 + g.random.Intn(6)
	sessions := 38 + g.random.Intn(16)
	queuedJobs := 7 + g.random.Intn(7)
	throughput := 1000 + g.random.Intn(500)
	errorRate := 0.15 + g.random.Float64()*0.95

	nodes := []Node{
		g.makeNode("gateway-core-01", "Primary coordinator", "us-east-1", 48, 22),
		g.makeNode("edge-router-02", "Ingress relay", "ap-southeast-1", 58, 25),
		g.makeNode("inference-worker-07", "Automation worker", "eu-central-1", 35, 18),
		g.makeNode("recovery-agent-01", "Failover standby", "us-west-2", 12, 14),
	}

	connections := []Connection{
		g.makeConnection("discord-primary", "Discord", 90, 120),
		g.makeConnection("telegram-broker", "Telegram", 150, 220),
		g.makeConnection("slack-status", "Slack", 70, 100),
		g.makeConnection("matrix-ops", "Matrix", 80, 140),
	}

	activities := []Activity{
		{
			Title:     "Autoscaler sync complete",
			Detail:    "Worker pool rebalance finished after throughput increase.",
			Timestamp: now.UTC().Format("15:04:05 MST"),
			Status:    "healthy",
		},
		{
			Title:     "Webhook retry burst detected",
			Detail:    "Telegram retries spiked for 34s and recovered automatically.",
			Timestamp: now.Add(-time.Minute).UTC().Format("15:04:05 MST"),
			Status:    "warning",
		},
		{
			Title:     "Credential rotation queued",
			Detail:    "Gateway shared secret update scheduled in the maintenance window.",
			Timestamp: now.Add(-2 * time.Minute).UTC().Format("15:04:05 MST"),
			Status:    "idle",
		},
	}

	return Snapshot{
		GeneratedAt:      now.UTC().Format(time.RFC3339),
		Cluster:          "openclaw-main",
		Environment:      "staging",
		Uptime:           formatUptime(now.Sub(g.startedAt)),
		ThroughputPerMin: throughput,
		ErrorRate:        roundFloat(errorRate, 2),
		Metrics: []Metric{
			makeMetric("Live gateways", 3, 0),
			makeMetric("Online workers", workers, g.random.Intn(5)-2),
			makeMetric("Channel sessions", sessions, g.random.Intn(7)-3),
			makeMetric("Queued automations", queuedJobs, g.random.Intn(5)-2),
		},
		Nodes:       nodes,
		Connections: connections,
		Activity:    activities,
	}
}

func (g *Generator) makeNode(name, role, region string, minLoad, variance int) Node {
	load := clamp(minLoad+g.random.Intn(variance), 5, 95)
	heartbeat := 4 + g.random.Intn(18)

	status := "healthy"
	if load >= 80 {
		status = "degraded"
	} else if load <= 15 {
		status = "idle"
	}

	return Node{
		Name:             name,
		Role:             role,
		Region:           region,
		Load:             load,
		HeartbeatSeconds: heartbeat,
		Status:           status,
	}
}

func (g *Generator) makeConnection(name, channel string, minLatency, maxLatency int) Connection {
	latency := minLatency + g.random.Intn(maxLatency-minLatency+1)
	status := "connected"

	if latency > 180 {
		status = "throttled"
	} else if latency > 140 {
		status = "pending"
	}

	return Connection{
		Name:      name,
		Channel:   channel,
		LatencyMs: latency,
		Status:    status,
	}
}

func makeMetric(label string, value, delta int) Metric {
	trend := "flat"
	if delta > 0 {
		trend = "up"
	} else if delta < 0 {
		trend = "down"
	}

	return Metric{
		Label: label,
		Value: fmt.Sprintf("%d", value),
		Delta: fmt.Sprintf("%+d", delta),
		Trend: trend,
	}
}

func formatUptime(duration time.Duration) string {
	if duration < 0 {
		duration = 0
	}

	days := int(duration.Hours()) / 24
	hours := int(duration.Hours()) % 24
	return fmt.Sprintf("%dd %02dh", days, hours)
}

func roundFloat(value float64, precision int) float64 {
	factor := 1.0
	for i := 0; i < precision; i++ {
		factor *= 10
	}

	return float64(int(value*factor+0.5)) / factor
}

func clamp(value, minValue, maxValue int) int {
	if value < minValue {
		return minValue
	}
	if value > maxValue {
		return maxValue
	}
	return value
}
