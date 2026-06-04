import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

// Cliente para usar en Client Components ("use client").
// Gestiona la sesión automáticamente en el browser.
// Usar UN SOLO cliente por render — no llamar esto en un loop.
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
