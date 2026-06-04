import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Supabase redirige aquí después de que el usuario confirma su email
// o completa un flujo OAuth. Intercambia el código por una sesión.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Si viene un parámetro "next", redirigir allí después del login
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Si algo falló, volver al login con un indicador de error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
