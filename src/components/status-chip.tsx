import { formatStatusLabel, getStatusTone } from "@/lib/status";

type StatusChipProps = {
  status: string;
};

export function StatusChip({ status }: StatusChipProps) {
  const tone = getStatusTone(status);

  return (
    <span className={`status-chip ${tone}`}>{formatStatusLabel(status)}</span>
  );
}
