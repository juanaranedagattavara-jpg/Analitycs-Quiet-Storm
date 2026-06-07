import type { MetadataRoute } from "next";

// Bloqueado hasta go-live día 29 del sprint.
// Cambiar a allow:"/" cuando se haga go-live público.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
