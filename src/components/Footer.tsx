import Link from "next/link";
import { site } from "@/lib/site";

const cols = [
  {
    title: "Productos",
    links: [
      { label: "Reportes PDF", href: "/#productos" },
      { label: "Archivos Excel", href: "/#productos" },
      { label: "Dashboards Interactivos", href: "/#productos" },
      { label: "Price Check", href: "/#productos" },
    ],
  },
  {
    title: "Industrias",
    links: [
      { label: "Mitilicultura", href: "/industrias/mitilicultura" },
      { label: "Erizos y Jaibas", href: "/industrias/erizos-jaibas" },
      { label: "Algas y Musgos", href: "/industrias/algas" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre nosotros", href: "/sobre-nosotros" },
      { label: "Precios", href: "/precios" },
      { label: "Contacto", href: "/contacto" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacidad", href: "/legal/privacidad" },
      { label: "Términos", href: "/legal/terminos" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-storm-midnight text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-12">
          <div className="col-span-2 lg:col-span-2 max-w-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-full bg-storm-deep flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-7 h-7" aria-hidden="true">
                  <path
                    d="M11 22c0-2.8 2.2-5 5-5 .5-2.4 2.6-4.2 5.1-4.2 2.9 0 5.2 2.3 5.2 5.2 0 .2 0 .4 0 .6 1.5.4 2.7 1.7 2.7 3.4 0 1.9-1.6 3.5-3.5 3.5H15c-2.2 0-4-1.8-4-3.5z"
                    fill="#dce8ef"
                    opacity="0.9"
                  />
                  <path d="M21 21l-3 5h3l-2 5 5-7h-3l2-3h-2z" fill="#f7c948" />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg font-semibold">Quiet Storm</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-storm-fog">
                  Analytics
                </span>
              </div>
            </div>
            <p className="text-sm text-storm-fog leading-relaxed">
              Consultora chilena de inteligencia de mercado fundada hace más de 20 años.
              Especializados en exportadores de productos del mar: mejillones, erizos,
              jaibas y algas.
            </p>
            <div className="mt-6 space-y-2 text-sm">
              <a
                href={`mailto:${site.email}`}
                className="block text-storm-spray hover:text-lightning transition-colors"
              >
                {site.email}
              </a>
              <p className="text-storm-fog">{site.location}</p>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-storm-fog mb-4">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-storm-spray hover:text-lightning transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-storm-deep flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <p className="text-xs text-storm-fog">
            © {new Date().getFullYear()} {site.name}. Inteligencia de mercado para
            exportadores chilenos de productos del mar.
          </p>
          <div className="flex items-center gap-5 text-xs text-storm-fog">
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-lightning transition-colors flex items-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
