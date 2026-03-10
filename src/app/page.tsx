import { DashboardShell } from "@/components/dashboard-shell";
import {
  activityFeed,
  connectionInventory,
  gatewayMetrics,
  gatewaySummary,
  nodeInventory,
  quickActions,
} from "@/data/control-panel";

export default function Home() {
  return (
    <DashboardShell
      activityFeed={activityFeed}
      connectionInventory={connectionInventory}
      gatewayMetrics={gatewayMetrics}
      gatewaySummary={gatewaySummary}
      nodeInventory={nodeInventory}
      quickActions={quickActions}
    />
  );
}
