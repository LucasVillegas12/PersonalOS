import type { CapacitorConfig } from "@capacitor/cli";

const isDev = process.env.NODE_ENV !== "production";

const config: CapacitorConfig = {
  appId: "com.personalos.app",
  appName: "PersonalOS",
  webDir: "out", // Solo usado si se hace static export en el futuro
  server: {
    // En desarrollo: apunta a Next.js local
    // En producción: apunta a Vercel (cambiar por la URL real después del deploy)
    url: isDev
      ? "http://localhost:3000"
      : "https://personalos.vercel.app",
    cleartext: isDev, // Permite HTTP solo en dev (iOS requiere HTTPS en prod)
  },
  ios: {
    contentInset: "automatic",
  },
  plugins: {
    // @capacitor/preferences: storage nativo para token de sesión Supabase
    Preferences: {
      group: "NativeStorage",
    },
  },
};

export default config;
