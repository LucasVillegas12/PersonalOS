import { MetricType, METRIC_TYPES } from "@/types/metrics";

export interface MetricConfig {
  label:       string;   // Nombre para mostrar
  unit:        string;   // Unidad de display
  icon:        string;   // Emoji representativo
  color:       string;   // Color del chart (Tailwind hex)
  decimals:    number;   // Decimales en el valor mostrado
  description: string;   // Descripción corta para el card
}

export const METRIC_CONFIG: Record<MetricType, MetricConfig> = {
  [METRIC_TYPES.STEPS]: {
    label:       "Pasos",
    unit:        "pasos",
    icon:        "👟",
    color:       "#3b82f6", // blue-500
    decimals:    0,
    description: "Pasos diarios totales",
  },
  [METRIC_TYPES.ACTIVE_CALORIES]: {
    label:       "Calorías activas",
    unit:        "kcal",
    icon:        "🔥",
    color:       "#f97316", // orange-500
    decimals:    0,
    description: "Calorías quemadas en actividad",
  },
  [METRIC_TYPES.SLEEP]: {
    label:       "Sueño",
    unit:        "hs",
    icon:        "🌙",
    color:       "#8b5cf6", // violet-500
    decimals:    1,
    description: "Horas de sueño por noche",
  },
  [METRIC_TYPES.BODY_WEIGHT]: {
    label:       "Peso corporal",
    unit:        "kg",
    icon:        "⚖️",
    color:       "#10b981", // emerald-500
    decimals:    1,
    description: "Peso corporal en kg",
  },
};

// Genera 7 días de datos de ejemplo para el mini chart.
// Se usa solo hasta que HealthKit provea datos reales.
export function generateMockSeries(
  metricType: MetricType,
  days = 7
): Array<{ date: string; value: number }> {
  const mockRanges: Record<MetricType, [number, number]> = {
    steps:           [6000,  12000],
    active_calories: [300,   700],
    sleep:           [360,   510],   // minutos → se convierte a horas en display
    body_weight:     [74.5,  76.0],
  };

  const [min, max] = mockRanges[metricType];
  const result = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const value = +(Math.random() * (max - min) + min).toFixed(1);
    result.push({
      date:  date.toISOString().split("T")[0],
      value,
    });
  }
  return result;
}

// Formatea el valor según el tipo de métrica para display
export function formatMetricValue(type: MetricType, value: number): string {
  const config = METRIC_CONFIG[type];

  if (type === METRIC_TYPES.SLEEP) {
    // Convierte minutos → "7.5 hs"
    const hours = value / 60;
    return hours.toFixed(config.decimals);
  }

  if (type === METRIC_TYPES.STEPS) {
    // Formatea miles: 10.234 → "10.234"
    return Math.round(value).toLocaleString("es-AR");
  }

  return value.toFixed(config.decimals);
}
