import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PersonalOS",
  description: "Tu sistema operativo personal de salud y rendimiento",
  // PWA / iOS: evita que Safari muestre la barra de dirección cuando se añade a pantalla de inicio
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PersonalOS",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Previene zoom en inputs de iOS (UX en Capacitor)
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
