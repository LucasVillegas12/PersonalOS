"use client";

import dynamic from "next/dynamic";
import { MetricType } from "@/types/metrics";
import {
  METRIC_CONFIG,
  formatMetricValue,
} from "@/lib/metrics/constants";
import type { DashboardMetric } from "@/types/metrics";

// Chart cargado dinámicamente — Recharts no es compatible con SSR
const MetricChart = dynamic(
  () => import("./MetricChart"),
  {
    ssr:     false,
    loading: () => <div className="h-16 bg-gray-50 rounded animate-pulse" />,
  }
);

interface MetricCardProps {
  metric: DashboardMetric;
}

// Calcula tendencia comparando último valor con el penúltimo
function getTrend(series: DashboardMetric["series"]): {
  direction: "up" | "down" | "flat";
  percent:   number;
} {
  if (series.length < 2) return { direction: "flat", percent: 0 };

  const last = series[series.length - 1].value;
  const prev = series[series.length - 2].value;

  if (prev === 0) return { direction: "flat", percent: 0 };

  const percent = ((last - prev) / prev) * 100;

  if (Math.abs(percent) < 1) return { direction: "flat",  percent: 0 };
  return {
    direction: percent > 0 ? "up" : "down",
    percent:   Math.abs(percent),
  };
}

// Determina si una tendencia es positiva o negativa según la métrica
function isTrendPositive(type: MetricType, direction: "up" | "down" | "flat"): boolean | null {
  if (direction === "flat") return null;

  // Para peso: depende del objetivo — por ahora neutro
  // Para sueño: más es mejor
  // Para pasos y calorías: más es mejor
  const moreIsBetter: MetricType[] = ["steps", "active_calories", "sleep"];

  if (moreIsBetter.includes(type)) {
    return direction === "up";
  }
  return null; // neutro para peso
}

export default function MetricCard({ metric }: MetricCardProps) {
  const config = METRIC_CONFIG[metric.type];
  const trend  = getTrend(metric.series);
  const isPositive = isTrendPositive(metric.type, trend.direction);

  const trendColor =
    isPositive === true  ? "text-emerald-600" :
    isPositive === false ? "text-red-500"      :
    "text-gray-400";

  const trendIcon =
    trend.direction === "up"   ? "↑" :
    trend.direction === "down" ? "↓" :
    "→";

  const lastRecorded = metric.last_recorded
    ? new Date(metric.last_recorded).toLocaleDateString("es-AR", {
        day:   "numeric",
        month: "short",
      })
    : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3">
      {/* Fila superior: ícono + label + fecha */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none">{config.icon}</span>
          <span className="text-sm font-medium text-gray-700">{config.label}</span>
        </div>
        {lastRecorded && (
          <span className="text-xs text-gray-400">{lastRecorded}</span>
        )}
      </div>

      {/* Valor principal + tendencia */}
      <div className="flex items-end gap-2">
        {metric.value !== null ? (
          <>
            <span className="text-3xl font-semibold text-gray-900 leading-none tabular-nums">
              {formatMetricValue(metric.type, metric.value)}
            </span>
            <span className="text-sm text-gray-400 mb-0.5">{config.unit}</span>
            {trend.direction !== "flat" && (
              <span className={`text-sm font-medium mb-0.5 ml-auto ${trendColor}`}>
                {trendIcon} {trend.percent.toFixed(0)}%
              </span>
            )}
          </>
        ) : (
          <span className="text-sm text-gray-400">Sin datos aún</span>
        )}
      </div>

      {/* Mini chart */}
      {metric.series.length > 1 && (
        <MetricChart type={metric.type} series={metric.series} />
      )}
    </div>
  );
}
