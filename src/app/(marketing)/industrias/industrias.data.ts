export type Industria = {
  slug: string;
  nombre: string;
  badge: string;
  hero: {
    eyebrow: string;
    headline: string;
    accent: string;
    subhead: string;
  };
  mercados: string[];
  calibres: { code: string; description: string }[];
  desafios: { title: string; body: string }[];
  reportes: string[];
  faqs: { q: string; a: string }[];
};

export const industrias: Record<string, Industria> = {
  mitilicultura: {
    slug: "mitilicultura",
    nombre: "Mitilicultura",
    badge: "MUSSEL METRICS",
    hero: {
      eyebrow: "Mitilicultura · Mejillones",
      headline: "Inteligencia de mercado para",
      accent: "exportadores de mejillones",
      subhead:
        "Chile es el segundo productor mundial de mejillones. Pero competir contra Galicia, Nueva Zelanda y Corea exige más que producir bien: exige saber a qué precio, qué calibre y qué destino están comprando los mercados. MUSSEL METRICS te lo entrega en una plataforma.",
    },
    mercados: ["España", "Italia", "Francia", "Rusia", "USA", "Brasil"],
    calibres: [
      { code: "CA0-CA4", description: "Mejillón carne — peso por gramo de carne" },
      { code: "EN0-EN4", description: "Mejillón entero — clasificación por largo" },
      { code: "MV0-MV4", description: "Media valva — clasificación por largo y carne" },
    ],
    desafios: [
      {
        title: "Volatilidad de precios FOB",
        body: "El FOB CA2 a España fluctúa con la demanda gallega, el tipo de cambio EUR/USD y la oferta de Nueva Zelanda. Sin datos en tiempo real, dejas margen en la mesa.",
      },
      {
        title: "Competencia desigual por calibre",
        body: "No todos los calibres rinden igual en cada mercado. España premia CA2 y CA3. Italia paga mejor por MV2-MV3. Sin desglose, pierdes optimización.",
      },
      {
        title: "Estacionalidad y trazabilidad UE",
        body: "Las exigencias de trazabilidad europea suben costos. Saber qué exportadores cumplen y cuáles no te da ventaja competitiva concreta.",
      },
    ],
    reportes: [
      "Análisis competitivo mensual (top 10 exportadores)",
      "FOB CA0-CA4 por destino y empresa",
      "Participación de mercado España, Italia, Francia, Rusia",
      "Tendencias estacionales y proyecciones",
      "Spread por mercado (oportunidad de arbitraje)",
      "Descarga de datos: producto × destino × empresa × calibre",
      "Tablero Mussel Metrics dentro de la plataforma",
    ],
    faqs: [
      {
        q: "¿De dónde sacan los datos de mejillones?",
        a: "Servicio Nacional de Pesca (Sernapesca), Aduanas Chile, ProChile y nuestra base propietaria de +20 años. Cruzamos fuentes para validar.",
      },
      {
        q: "¿Cubren mejillones congelados y frescos?",
        a: "Sí. Carne (CA), entero (EN) y media valva (MV) — congelado y fresco, todos los calibres.",
      },
      {
        q: "¿Puedo ver datos históricos?",
        a: "Sí. Hasta 20 años de historia disponibles en la plataforma. Útil para detectar ciclos estacionales y posicionar tu temporada.",
      },
      {
        q: "¿Cómo se actualiza?",
        a: "Datos de exportaciones se actualizan mensualmente. Dashboards FOB y volúmenes refrescan automáticamente cuando llegan los datos oficiales.",
      },
    ],
  },

  "erizos-jaibas": {
    slug: "erizos-jaibas",
    nombre: "Erizos y Jaibas",
    badge: "SEAFARM METRICS",
    hero: {
      eyebrow: "Erizos · Jaibas · Premium",
      headline: "Datos para exportadores de",
      accent: "productos premium del mar",
      subhead:
        "Chile es origen #1 mundial de erizo. Japón concentra el 92% del valor. Corea es el segundo mercado. SEAFARM METRICS te muestra precios, volúmenes y dinámicas de los mercados premium donde una diferencia de USD 2/kg cambia tu temporada.",
    },
    mercados: ["Japón", "Corea del Sur", "USA", "Hong Kong"],
    calibres: [
      { code: "EN1-EN4", description: "Erizo entero — clasificación por tamaño" },
      { code: "Premium / Estándar", description: "Calidad para mercado japonés" },
      { code: "Jaiba entera / pulpa", description: "Clasificación por destino industrial" },
    ],
    desafios: [
      {
        title: "Concentración en Japón",
        body: "92% del valor del erizo chileno va a Japón. Una caída del yen o un cambio regulatorio impacta toda la temporada. Necesitas anticipar.",
      },
      {
        title: "Competencia con Rusia y Maine",
        body: "Erizo ruso (Sakhalin) y de Maine son competidores directos en Japón. Sus volúmenes y precios definen tu margen de negociación.",
      },
      {
        title: "Logística refrigerada premium",
        body: "Productos de alto valor requieren cold chain perfecto. Conocer la curva de precios por semana te ayuda a optimizar timing de embarque.",
      },
    ],
    reportes: [
      "FOB Japón y Corea por empresa exportadora",
      "Participación de Chile vs Rusia vs Maine en Japón",
      "Evolución JPY/USD y su impacto en márgenes",
      "Análisis estacional erizo (temporada chilena vs sustitutos)",
      "Jaibas: mercados destino y precios",
      "Dashboard SEAFARM METRICS",
    ],
    faqs: [
      {
        q: "¿Cubren erizo rojo y morado?",
        a: "Sí, ambos. Con clasificación por calibre y por mercado destino.",
      },
      {
        q: "¿Cómo manejan la confidencialidad por empresa?",
        a: "Los datos por empresa son agregados a nivel exportador. Nunca cruzamos info entre clientes. Tu data jamás se publica.",
      },
      {
        q: "¿Incluyen análisis de competidores extranjeros?",
        a: "Sí. Rusia (Sakhalin), Maine (USA), Filipinas. Comparativa de FOB, volúmenes y participación en mercados destino.",
      },
    ],
  },

  algas: {
    slug: "algas",
    nombre: "Algas y Musgos",
    badge: "MOSS METRICS",
    hero: {
      eyebrow: "Algas · Musgos · Carragenina",
      headline: "Inteligencia de mercado para",
      accent: "exportadores de algas marinas",
      subhead:
        "Chile lidera la producción de musgos productores de carragenina. China e Indonesia son competidores. MOSS METRICS te muestra precios, demanda industrial y movimientos de competidores para que tus contratos de temporada estén respaldados por datos.",
    },
    mercados: ["China", "Japón", "USA", "Europa", "Filipinas"],
    calibres: [
      { code: "Cochayuyo", description: "Mercado interno y export" },
      { code: "Luga (Mazzaella)", description: "Productor de carragenina" },
      { code: "Pelillo (Gracilaria)", description: "Productor de agar-agar" },
      { code: "Huiro (Macrocystis)", description: "Industrial y consumo humano" },
    ],
    desafios: [
      {
        title: "Volatilidad de precios industriales",
        body: "Carragenina y agar dependen de demanda industrial (alimentos, farma, cosmética). Caídas en demanda China impactan toda la cadena.",
      },
      {
        title: "Competencia con Indonesia y Filipinas",
        body: "Productores asiáticos tienen costos menores. Saber sus volúmenes y precios FOB es clave para negociar tus contratos.",
      },
      {
        title: "Regulación pesquera artesanal",
        body: "Cuotas, vedas y certificaciones cambian. Anticipar regulación te permite ajustar volúmenes y contratos.",
      },
    ],
    reportes: [
      "FOB carragenina (luga, chasca) por destino",
      "Volúmenes Indonesia y Filipinas vs Chile",
      "Demanda industrial China, Japón, USA",
      "Análisis de cuotas y temporadas",
      "Dashboard MOSS METRICS",
    ],
    faqs: [
      {
        q: "¿Cubren cochayuyo para mercado interno?",
        a: "Cobertura principal es export. Mercado interno disponible bajo solicitud personalizada.",
      },
      {
        q: "¿Qué tipo de algas analizan?",
        a: "Luga, pelillo, huiro, cochayuyo. Análisis de cada especie y su mercado destino principal.",
      },
      {
        q: "¿Incluyen análisis de procesados (carragenina/agar)?",
        a: "Sí. Trazamos desde el alga cruda hasta los productos procesados que llegan a destino industrial.",
      },
    ],
  },
};

export const industriasList = Object.values(industrias);
