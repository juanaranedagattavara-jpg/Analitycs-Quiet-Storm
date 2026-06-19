import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Quiet Storm Analytics — Inteligencia de mercado para exportadores chilenos",
    template: "%s | Quiet Storm Analytics",
  },
  description:
    "Plataforma de inteligencia de mercado para exportadores chilenos de productos del mar. Precios de tus competidores, informes a medida y datos por calibre, destino y empresa. Más de 20 años de experiencia.",
  metadataBase: new URL("https://quietstormanalytics.com"),
  openGraph: {
    title: "Quiet Storm Analytics",
    description:
      "Inteligencia de mercado para exportadores chilenos de productos del mar. Mejillones, erizos, jaibas, algas.",
    locale: "es_CL",
    type: "website",
  },
  robots: {
    index: false, // Bloqueado hasta go-live día 29
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1f33",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es-CL"
      className={`${inter.variable} ${fraunces.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-storm-midnight">
        {children}
      </body>
    </html>
  );
}
