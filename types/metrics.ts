// Los 4 metric_type de Fase 1.
// Extensible: agregar aquí cuando se sumen nuevas métricas en fases siguientes.
export const METRIC_TYPES = {
  STEPS:            "steps",
  ACTIVE_CALORIES:  "active_calories",
  SLEEP:            "sleep",
  BODY_WEIGHT:      "body_weight",
} as const;

export type MetricType = typeof METRIC_TYPES[keyof typeof METRIC_TYPES];

// Unidades canónicas por tipo de métrica.
// Todos los valores se almacenan en estas unidades en la DB,
// independientemente de lo que devuelva HealthKit.
export const METRIC_UNITS: Record<MetricType, string> = {
  steps:            "count",
  active_calories:  "kcal",
  sleep:            "minutes",
  body_weight:      "kg",
};

// Fuentes de datos válidas
export type MetricSource = "apple_health" | "manual" | "garmin" | "strava";

// Forma exacta de una fila en health_metrics
export interface HealthMetric {
  id:           string;
  user_id:      string;
  metric_type:  MetricType;
  value:        number;
  unit:         string;
  source:       MetricSource;
  metadata:     Record<string, unknown> | null;
  recorded_at:  string; // ISO 8601
  synced_at:    string; // ISO 8601
  created_at:   string; // ISO 8601
}

// Forma exacta de una fila en sync_checkpoints
export interface SyncCheckpoint {
  id:              string;
  user_id:         string;
  metric_type:     MetricType;
  last_synced_at:  string | null; // null = nunca sincronizado
  status:          "idle" | "syncing" | "error";
  records_synced:  number;
  created_at:      string;
  updated_at:      string;
}

// Payload que la app iOS envía a la Edge Function ingest-metrics
export interface IngestPayload {
  metrics: Array<{
    metric_type: MetricType;
    value:       number;
    unit:        string;
    source:      MetricSource;
    recorded_at: string;
    metadata?:   Record<string, unknown>;
  }>;
}

// Respuesta de la Edge Function ingest-metrics
export interface IngestResponse {
  inserted:   number;
  duplicates: number;
  errors:     number;
}

// Dato procesado para mostrar en el dashboard
export interface DashboardMetric {
  type:          MetricType;
  label:         string;
  value:         number | null;
  unit:          string;
  last_recorded: string | null;
  // Serie de los últimos 7 días para el mini chart
  series: Array<{
    date:  string; // YYYY-MM-DD
    value: number;
  }>;
}
