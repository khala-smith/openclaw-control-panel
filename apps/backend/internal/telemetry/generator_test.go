package telemetry

import (
	"testing"
	"time"
)

func TestSnapshotShape(t *testing.T) {
	generator := NewGenerator(42, time.Date(2026, 3, 1, 0, 0, 0, 0, time.UTC))
	snapshot := generator.Snapshot(time.Date(2026, 3, 11, 8, 0, 0, 0, time.UTC))

	if snapshot.GeneratedAt == "" {
		t.Fatal("expected generatedAt to be set")
	}

	if len(snapshot.Metrics) != 4 {
		t.Fatalf("expected 4 metrics, got %d", len(snapshot.Metrics))
	}

	if len(snapshot.Nodes) != 4 {
		t.Fatalf("expected 4 nodes, got %d", len(snapshot.Nodes))
	}

	if len(snapshot.Connections) != 4 {
		t.Fatalf("expected 4 connections, got %d", len(snapshot.Connections))
	}

	if len(snapshot.Activity) != 3 {
		t.Fatalf("expected 3 activities, got %d", len(snapshot.Activity))
	}
}

func TestSnapshotRanges(t *testing.T) {
	generator := NewGenerator(99, time.Date(2026, 3, 5, 0, 0, 0, 0, time.UTC))
	snapshot := generator.Snapshot(time.Date(2026, 3, 11, 8, 0, 0, 0, time.UTC))

	if snapshot.ErrorRate <= 0 {
		t.Fatalf("expected error rate > 0, got %.2f", snapshot.ErrorRate)
	}

	for _, node := range snapshot.Nodes {
		if node.Load < 0 || node.Load > 100 {
			t.Fatalf("node load out of range: %+v", node)
		}

		if node.HeartbeatSeconds <= 0 {
			t.Fatalf("heartbeat should be positive: %+v", node)
		}
	}

	for _, connection := range snapshot.Connections {
		if connection.LatencyMs <= 0 {
			t.Fatalf("latency should be positive: %+v", connection)
		}
	}
}
