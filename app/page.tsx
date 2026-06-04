import { redirect } from "next/navigation";

// La raíz redirige al dashboard.
// El middleware interceptará si no hay sesión y mandará al login.
export default function RootPage() {
  redirect("/dashboard");
}
