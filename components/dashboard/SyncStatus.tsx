import { MetricType, METRIC_TYPES } from "@/types/metrics";
import type { SyncCheckpoint } from "@/types/metrics";

interface SyncStatusProps {
  checkpoints: SyncCheckpoint[];
}

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins  / 60);
  const days  = Math.floor(hours / 24);

  if (mins  < 1)   return "ahora mismo";
  if (mins  < 60)  return `hace ${mins}m`;
  if (hours < 24)  return `hace ${hours}h`;
  return `hace ${days}d`;
}

const METRIC_LABELS: Record<MetricType, string> = {
  [METRIC_TYPES.STEPS]:           "Pasos",
  [METRIC_TYPES.ACTIVE_CALORIES]: "Calorías",
  [METRIC_TYPES.SLEEP]:           "Sueño",
  [METRIC_TYPES.BODY_WEIGHT]:     "Peso",
};

export default function SyncStatus({ checkpoints }: SyncStatusProps) {
  if (checkpoints.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
        <span className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0" />
        <span className="text-xs text-amber-700">
          Sin sincronizar — abrí la app en iPhone para importar datos de Apple Health
        </span>
      </div>
    );
  }

  // Última sync entre todos los tipos
  const lastSync = checkpoints
    .filter((c) => c.last_synced_at !== null)
    .sort(
      (a, b) =>
        new Date(b.last_synced_at!).getTime() -
        new Date(a.last_synced_at!).getTime()
    )[0];

  const hasSyncing = checkpoints.some((c) => c.status === "syncing");
  const hasError   = checkpoints.some((c) => c.status === "error");

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl">
      <div className="flex items-center gap-2">
        {hasSyncing ? (
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse flex-shrink-0" />
        ) : hasError ? (
          <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
        ) : (
          <span className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
        )}
        <span className="text-xs text-gray-600">
          {hasSyncing
            ? "Sincronizando Apple Health..."
            : hasError
            ? "Error en última sincronización"
            : lastSync?.last_synced_at
            ? `Sincronizado ${timeAgo(lastSync.last_synced_at)}`
            : "Sin sincronizar aún"}
        </span>
      </div>

      {/* Detalle por tipo */}
      <div className="hidden sm:flex items-center gap-3">
        {checkpoints.map((cp) => (
          <span key={cp.metric_type} className="text-xs text-gray-400">
            {METRIC_LABELS[cp.metric_type as MetricType]}
            {cp.last_synced_at ? (
              <span className="text-emerald-500 ml-1">✓</span>
            ) : (
              <span className="text-gray-300 ml-1">–</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
