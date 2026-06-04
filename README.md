# PersonalOS

Sistema operativo personal de salud y rendimiento deportivo.
Centraliza datos de Apple Health, entrenamiento, nutrición, sueño y composición corporal.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend / App | Next.js 15 (App Router) |
| Mobile | Capacitor 6 (iOS) |
| Backend | Supabase (PostgreSQL + Auth + Edge Functions) |
| Charts | Recharts |
| Estilos | Tailwind CSS |

## Estructura

```
personalos/
├── app/                    # Next.js App Router
│   ├── login/              # Autenticación
│   ├── callback/           # OAuth callback de Supabase
│   └── dashboard/          # Dashboard principal
├── components/
│   ├── dashboard/          # MetricCard, MetricChart, SyncStatus
│   └── ui/                 # Button, Card, Spinner (primitivos)
├── lib/
│   ├── supabase/           # client.ts, server.ts, middleware.ts
│   ├── healthkit/          # Bridge JS con el plugin nativo de iOS
│   └── metrics/            # queries.ts, constants.ts
├── types/
│   ├── metrics.ts          # Tipos de dominio (MetricType, etc.)
│   └── database.ts         # Tipos de Supabase (generados)
├── supabase/
│   ├── migrations/         # SQL de las 4 tablas + índices + RLS
│   └── functions/
│       └── ingest-metrics/ # Edge Function de ingesta
├── ios/                    # Proyecto Xcode (generado por Capacitor)
├── capacitor.config.ts     # Config de Capacitor
└── .env.local              # Variables de entorno (no se commitea)
```

## Setup inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env.local
# Completar con los valores del proyecto de Supabase
```

### 3. Ejecutar migraciones en Supabase

Desde el dashboard de Supabase → SQL Editor, ejecutar en orden:
- `supabase/migrations/001_profiles.sql`
- `supabase/migrations/002_health_metrics.sql`
- `supabase/migrations/003_sync_checkpoints.sql`
- `supabase/migrations/004_rls_policies.sql`

### 4. Generar tipos de TypeScript

```bash
npm run supabase:types
```

### 5. Correr en desarrollo

```bash
npm run dev
```

### 6. Setup iOS (después del deploy a Vercel)

```bash
# Instalar Xcode y CocoaPods primero
npm run cap:sync   # Sincroniza el proyecto iOS
npm run cap:open   # Abre en Xcode
```

## Fases de desarrollo

| Fase | Estado | Descripción |
|------|--------|-------------|
| Fase 1 | 🔄 En progreso | Fundaciones: Auth + Dashboard + HealthKit sync |
| Fase 2 | ⏳ Pendiente | Módulos de dominio: workouts, sueño, peso |
| Fase 3 | ⏳ Pendiente | Analytics e insights |
| Fase 4 | ⏳ Pendiente | Hábitos y objetivos |
| Fase 5 | ⏳ Pendiente | Optimización y features avanzados |

## Métricas de Fase 1

- `steps` — Pasos diarios
- `active_calories` — Calorías activas
- `sleep` — Tiempo total de sueño (minutos)
- `body_weight` — Peso corporal (kg)

## Notas importantes

- **HealthKit solo funciona en dispositivo físico**, no en simulador.
- La app iOS apunta a la URL de Vercel en producción.
- En desarrollo, `capacitor.config.ts` apunta a `localhost:3000`.
- Los tokens de sesión de Supabase se persisten con `@capacitor/preferences`, no con `localStorage`.
