import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/login/actions";
import MetricCard from "@/components/dashboard/MetricCard";
import SyncStatus from "@/components/dashboard/SyncStatus";
import { getAllDashboardMetrics } from "@/lib/metrics/queries";
import type { SyncCheckpoint } from "@/types/metrics";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, email")
    .eq("id", user.id)
    .single();

  // Cargar métricas reales y checkpoints en paralelo
  const [metrics, checkpointsResult] = await Promise.all([
    getAllDashboardMetrics(user.id),
    supabase
      .from("sync_checkpoints")
      .select("*")
      .eq("user_id", user.id),
  ]);

  const checkpoints = (checkpointsResult.data ?? []) as SyncCheckpoint[];
  const hasRealData = metrics.some((m) => m.value !== null);
  const displayName =
  (profile as { display_name?: string | null; email?: string | null } | null)?.display_name ??
  (profile as { display_name?: string | null; email?: string | null } | null)?.email ??
  user.email ??
  "Atleta";

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Buenos días" :
    hour < 19 ? "Buenas tardes" :
    "Buenas noches";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 safe-top">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-gray-900">PersonalOS</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {greeting}, {displayName}
            </p>
          </div>
          <form>
            <button
              formAction={logout}
              className="text-sm text-gray-400 hover:text-gray-700 transition-colors px-2 py-1"
            >
              Salir
            </button>
          </form>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Sync status — checkpoints reales de Supabase */}
        <SyncStatus checkpoints={checkpoints} />

        {/* Métricas */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Hoy
            </h2>
            <span className="text-xs text-gray-400">
              {new Date().toLocaleDateString("es-AR", {
                weekday: "long",
                day:     "numeric",
                month:   "long",
              })}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {metrics.map((metric) => (
              <MetricCard key={metric.type} metric={metric} />
            ))}
          </div>
        </div>

        {/* Banner: sin datos reales todavía */}
        {!hasRealData && (
          <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
            <p className="text-xs text-blue-700">
              <span className="font-medium">Sin datos aún</span> — abrí la app en iPhone para sincronizar Apple Health
            </p>
          </div>
        )}

      </div>
    </main>
  );
}
