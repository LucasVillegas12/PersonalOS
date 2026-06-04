import { createClient } from "@/lib/supabase/server";
import { METRIC_TYPES, type MetricType, type DashboardMetric } from "@/types/metrics";
import { METRIC_CONFIG, formatMetricValue } from "@/lib/metrics/constants";

// ── Último valor registrado de una métrica ────────────────────
export async function getLatestMetric(
  userId: string,
  metricType: MetricType
): Promise<{ value: number; recorded_at: string } | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("health_metrics")
    .select("value, recorded_at")
    .eq("user_id", userId)
    .eq("metric_type", metricType)
    .order("recorded_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;
  return data;
}

// ── Serie de los últimos N días para el mini chart ────────────
// Devuelve un punto por día: el último valor registrado ese día.
export async function getMetricSeries(
  userId: string,
  metricType: MetricType,
  days = 7
): Promise<Array<{ date: string; value: number }>> {
  const supabase = await createClient();

  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from("health_metrics")
    .select("value, recorded_at")
    .eq("user_id", userId)
    .eq("metric_type", metricType)
    .gte("recorded_at", since.toISOString())
    .order("recorded_at", { ascending: true });

  if (error || !data || data.length === 0) return [];

  // Agrupar por día — si hay múltiples valores por día, tomar el último
  type MetricRow = {
  recorded_at: string;
  value: number;
};

const rows = (data ?? []) as MetricRow[];

const byDay = new Map<string, number>();
for (const row of rows) {
  const day = row.recorded_at.split("T")[0];
  byDay.set(day, row.value);
 // los datos vienen asc, el último pisará los anteriores
  }

  return Array.from(byDay.entries()).map(([date, value]) => ({ date, value }));
}

// ── Construye el DashboardMetric completo para una métrica ────
export async function getDashboardMetric(
  userId: string,
  metricType: MetricType
): Promise<DashboardMetric> {
  const config = METRIC_CONFIG[metricType];

  const [latest, series] = await Promise.all([
    getLatestMetric(userId, metricType),
    getMetricSeries(userId, metricType, 7),
  ]);

  return {
    type:          metricType,
    label:         config.label,
    value:         latest?.value ?? null,
    unit:          config.unit,
    last_recorded: latest?.recorded_at ?? null,
    series,
  };
}

// ── Carga las 4 métricas en paralelo ─────────────────────────
export async function getAllDashboardMetrics(
  userId: string
): Promise<DashboardMetric[]> {
  const metricTypes = [
    METRIC_TYPES.STEPS,
    METRIC_TYPES.ACTIVE_CALORIES,
    METRIC_TYPES.SLEEP,
    METRIC_TYPES.BODY_WEIGHT,
  ] as MetricType[];

  // Todas las queries en paralelo — no secuencial
  const results = await Promise.all(
    metricTypes.map((type) => getDashboardMetric(userId, type))
  );

  return results;
}
