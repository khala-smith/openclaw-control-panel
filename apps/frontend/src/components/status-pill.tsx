import { formatStatusLabel, getStatusTone, type StatusTone } from "@/lib/status";

const toneStyles: Record<StatusTone, string> = {
  healthy: "border-emerald-300 bg-emerald-100 text-emerald-700",
  warning: "border-amber-300 bg-amber-100 text-amber-700",
  critical: "border-rose-300 bg-rose-100 text-rose-700",
  idle: "border-slate-300 bg-slate-100 text-slate-600",
};

type StatusPillProps = {
  status: string;
};

export function StatusPill({ status }: StatusPillProps) {
  const tone = getStatusTone(status);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${toneStyles[tone]}`}
    >
      {formatStatusLabel(status)}
    </span>
  );
}
