-- ============================================================
-- seed_test.sql
-- Datos de prueba para verificar que el dashboard lee
-- correctamente de health_metrics.
--
-- IMPORTANTE: reemplazar el UUID de abajo con tu user_id real.
-- Lo encontrás en: Supabase → Authentication → Users → tu usuario
--
-- Ejecutar en: Supabase → SQL Editor
-- Eliminar con: DELETE FROM health_metrics WHERE source = 'manual';
-- ============================================================

"88d01ef0-ee59-4779-824c-b76f3a25bbc6"
DO $$
DECLARE
  test_user_id uuid := 'REEMPLAZAR-CON-TU-USER-ID';
  today date := current_date;
BEGIN

  -- ── Pasos (últimos 7 días) ──────────────────────────────────
  INSERT INTO public.health_metrics (user_id, metric_type, value, unit, source, recorded_at)
  VALUES
    (test_user_id, 'steps', 8432,  'count', 'manual', (today - 6)::timestamptz),
    (test_user_id, 'steps', 11205, 'count', 'manual', (today - 5)::timestamptz),
    (test_user_id, 'steps', 7891,  'count', 'manual', (today - 4)::timestamptz),
    (test_user_id, 'steps', 13042, 'count', 'manual', (today - 3)::timestamptz),
    (test_user_id, 'steps', 9617,  'count', 'manual', (today - 2)::timestamptz),
    (test_user_id, 'steps', 6234,  'count', 'manual', (today - 1)::timestamptz),
    (test_user_id, 'steps', 9842,  'count', 'manual', today::timestamptz)
  ON CONFLICT (user_id, metric_type, recorded_at, source) DO NOTHING;

  -- ── Calorías activas (últimos 7 días) ──────────────────────
  INSERT INTO public.health_metrics (user_id, metric_type, value, unit, source, recorded_at)
  VALUES
    (test_user_id, 'active_calories', 312, 'kcal', 'manual', (today - 6)::timestamptz),
    (test_user_id, 'active_calories', 521, 'kcal', 'manual', (today - 5)::timestamptz),
    (test_user_id, 'active_calories', 289, 'kcal', 'manual', (today - 4)::timestamptz),
    (test_user_id, 'active_calories', 634, 'kcal', 'manual', (today - 3)::timestamptz),
    (test_user_id, 'active_calories', 445, 'kcal', 'manual', (today - 2)::timestamptz),
    (test_user_id, 'active_calories', 198, 'kcal', 'manual', (today - 1)::timestamptz),
    (test_user_id, 'active_calories', 487, 'kcal', 'manual', today::timestamptz)
  ON CONFLICT (user_id, metric_type, recorded_at, source) DO NOTHING;

  -- ── Sueño en minutos (últimos 7 días) ──────────────────────
  -- 438 min = 7.3 hs, 462 min = 7.7 hs, etc.
  INSERT INTO public.health_metrics (user_id, metric_type, value, unit, source, recorded_at)
  VALUES
    (test_user_id, 'sleep', 392, 'minutes', 'manual', (today - 6)::timestamptz),
    (test_user_id, 'sleep', 461, 'minutes', 'manual', (today - 5)::timestamptz),
    (test_user_id, 'sleep', 418, 'minutes', 'manual', (today - 4)::timestamptz),
    (test_user_id, 'sleep', 495, 'minutes', 'manual', (today - 3)::timestamptz),
    (test_user_id, 'sleep', 374, 'minutes', 'manual', (today - 2)::timestamptz),
    (test_user_id, 'sleep', 442, 'minutes', 'manual', (today - 1)::timestamptz),
    (test_user_id, 'sleep', 438, 'minutes', 'manual', today::timestamptz)
  ON CONFLICT (user_id, metric_type, recorded_at, source) DO NOTHING;

  -- ── Peso corporal en kg (últimos 7 días) ───────────────────
  INSERT INTO public.health_metrics (user_id, metric_type, value, unit, source, recorded_at)
  VALUES
    (test_user_id, 'body_weight', 75.8, 'kg', 'manual', (today - 6)::timestamptz),
    (test_user_id, 'body_weight', 75.6, 'kg', 'manual', (today - 5)::timestamptz),
    (test_user_id, 'body_weight', 75.7, 'kg', 'manual', (today - 4)::timestamptz),
    (test_user_id, 'body_weight', 75.4, 'kg', 'manual', (today - 3)::timestamptz),
    (test_user_id, 'body_weight', 75.5, 'kg', 'manual', (today - 2)::timestamptz),
    (test_user_id, 'body_weight', 75.2, 'kg', 'manual', (today - 1)::timestamptz),
    (test_user_id, 'body_weight', 75.3, 'kg', 'manual', today::timestamptz)
  ON CONFLICT (user_id, metric_type, recorded_at, source) DO NOTHING;

END $$;

-- Verificar que los datos se insertaron correctamente
SELECT metric_type, count(*) as registros, max(recorded_at)::date as ultimo_dia
FROM public.health_metrics
GROUP BY metric_type
ORDER BY metric_type;
