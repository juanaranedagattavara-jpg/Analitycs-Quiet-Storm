"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { nav, site, ctas } from "@/lib/site";
import { cn } from "@/lib/cn";

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/85 backdrop-blur-md border-b border-storm-foam shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo />
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg lg:text-xl font-semibold tracking-tight text-storm-midnight">
                Quiet Storm
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-storm-mist">
                Analytics
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {nav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-active={active}
                  className={cn(
                    "nav-link text-[15px] font-medium",
                    active ? "text-storm-midnight" : "text-storm-steel"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href={ctas.platform.href}
              className="text-[15px] font-medium text-storm-steel hover:text-storm-midnight transition-colors"
            >
              Plataforma
            </Link>
            <Link
              href={ctas.trial.href}
              className="btn-lightning rounded-full h-10 px-5 text-sm font-semibold inline-flex items-center"
            >
              Prueba gratis
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden p-2 -mr-2 text-storm-midnight"
            aria-label="Menú"
            aria-expanded={mobileOpen}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              {mobileOpen ? (
                <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-storm-foam bg-white">
          <div className="px-6 py-6 flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-3 text-base font-medium text-storm-midnight border-b border-storm-foam/60 last:border-b-0"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={ctas.platform.href}
                className="h-12 inline-flex items-center justify-center rounded-full border border-storm-foam text-storm-midnight font-medium"
              >
                Plataforma
              </Link>
              <Link
                href={ctas.trial.href}
                className="btn-lightning h-12 inline-flex items-center justify-center rounded-full font-semibold"
              >
                Prueba gratis
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function Logo() {
  return (
    <div className="relative w-9 h-9 lg:w-10 lg:h-10 flex items-center justify-center">
      <svg viewBox="0 0 40 40" className="w-full h-full" aria-hidden="true">
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0a1f33" />
            <stop offset="100%" stopColor="#1b3a57" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="20" fill="url(#logoGrad)" />
        {/* Stylized storm cloud + lightning */}
        <path
          d="M11 22c0-2.8 2.2-5 5-5 .5-2.4 2.6-4.2 5.1-4.2 2.9 0 5.2 2.3 5.2 5.2 0 .2 0 .4 0 .6 1.5.4 2.7 1.7 2.7 3.4 0 1.9-1.6 3.5-3.5 3.5H15c-2.2 0-4-1.8-4-3.5z"
          fill="#dce8ef"
          opacity="0.9"
        />
        <path
          d="M21 21l-3 5h3l-2 5 5-7h-3l2-3h-2z"
          fill="#f7c948"
        />
      </svg>
    </div>
  );
}
