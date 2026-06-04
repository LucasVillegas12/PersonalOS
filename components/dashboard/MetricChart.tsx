"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
} from "recharts";
import { MetricType, METRIC_TYPES } from "@/types/metrics";
import { formatMetricValue, METRIC_CONFIG } from "@/lib/metrics/constants";

interface MetricChartProps {
  type:   MetricType;
  series: Array<{ date: string; value: number }>;
}

// Tooltip personalizado — muestra fecha corta y valor formateado
function CustomTooltip({
  active,
  payload,
  type,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  type:     MetricType;
}) {
  if (!active || !payload?.length) return null;

  const config = METRIC_CONFIG[type];
  const value  = payload[0].value;

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 shadow-sm text-xs">
      <span className="font-medium text-gray-900">
        {formatMetricValue(type, value)}
      </span>
      <span className="text-gray-500 ml-1">{config.unit}</span>
    </div>
  );
}

export default function MetricChart({ type, series }: MetricChartProps) {
  const config = METRIC_CONFIG[type];

  // Para sueño: convertir minutos → horas para el chart
  const chartData = series.map((point) => ({
    ...point,
    display:
      type === METRIC_TYPES.SLEEP
        ? +(point.value / 60).toFixed(2)
        : point.value,
    // Fecha corta: "lun", "mar", etc.
    label: new Date(point.date + "T12:00:00").toLocaleDateString("es-AR", {
      weekday: "short",
    }),
  }));

  return (
    <ResponsiveContainer width="100%" height={64}>
      <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`gradient-${type}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={config.color} stopOpacity={0.15} />
            <stop offset="95%" stopColor={config.color} stopOpacity={0}    />
          </linearGradient>
        </defs>

        <XAxis dataKey="label" hide />

        <Tooltip
          content={<CustomTooltip type={type} />}
          cursor={{ stroke: config.color, strokeWidth: 1, strokeDasharray: "3 3" }}
        />

        <Area
          type="monotone"
          dataKey="display"
          stroke={config.color}
          strokeWidth={2}
          fill={`url(#gradient-${type})`}
          dot={false}
          activeDot={{ r: 3, fill: config.color, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
