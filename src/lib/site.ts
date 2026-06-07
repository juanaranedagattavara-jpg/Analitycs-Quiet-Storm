export const site = {
  name: "Quiet Storm Analytics",
  shortName: "QSA",
  tagline: "Vemos la tormenta antes de que llegue a tu mercado.",
  description: "Plataforma de inteligencia de mercado para exportadores chilenos de productos del mar.",
  url: "https://quietstormanalytics.com",
  email: "info@quietstormanalytics.com",
  location: "Santiago, Chile",
  linkedin: "https://www.linkedin.com/company/quietstormanalytics",
  appUrl: "https://app.quietstormanalytics.com",
} as const;

export const nav = [
  { href: "/", label: "Inicio" },
  { href: "/precios", label: "Precios" },
  {
    href: "/industrias/mitilicultura",
    label: "Industrias",
    children: [
      { href: "/industrias/mitilicultura", label: "Mitilicultura" },
      { href: "/industrias/erizos-jaibas", label: "Erizos y Jaibas" },
      { href: "/industrias/algas", label: "Algas y Musgos" },
    ],
  },
  { href: "/sobre-nosotros", label: "Sobre nosotros" },
  { href: "/contacto", label: "Contacto" },
  { href: "/plataforma", label: "Plataforma" },
] as const;

export const ctas = {
  trial: {
    label: "Probar plataforma",
    href: "/plataforma",
  },
  demo: {
    label: "Solicita una demo",
    href: "/demo",
  },
} as const;
