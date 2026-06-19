import { requireAdmin } from '@/lib/auth/current-user'
import { handleError } from '@/lib/api/respond'
import * as XLSX from 'xlsx'

export async function GET() {
  try {
    await requireAdmin()

    const wb = XLSX.utils.book_new()

    const kpis = [
      { label: 'Valor FOB total', value: 12500000, unit: 'USD', delta_pct: 8.4 },
      { label: 'Volumen exportado', value: 4200, unit: 'ton', delta_pct: -2.1 },
      { label: 'Precio FOB promedio', value: 2.97, unit: 'USD/kg', delta_pct: 10.8 },
      { label: 'Empresas activas', value: 28, unit: '', delta_pct: 0 },
    ]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(kpis), 'KPIs')

    const ranking = [
      { empresa: 'Camanchaca', valor_fob_usd: 3200000, share_pct: 25.6, delta_pct: 12.4 },
      { empresa: 'Multiexport', valor_fob_usd: 2800000, share_pct: 22.4, delta_pct: 8.1 },
      { empresa: 'Blumar', valor_fob_usd: 1900000, share_pct: 15.2, delta_pct: -4.3 },
      { empresa: 'Ventisqueros', valor_fob_usd: 1500000, share_pct: 12.0, delta_pct: 18.7 },
      { empresa: 'AustralisMar', valor_fob_usd: 1100000, share_pct: 8.8, delta_pct: -1.5 },
    ]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ranking), 'Ranking')

    const marketShare = [
      { destino: 'China', valor_fob_usd: 4500000, share_pct: 36.0, delta_pct: 15.2 },
      { destino: 'Estados Unidos', valor_fob_usd: 3100000, share_pct: 24.8, delta_pct: 4.1 },
      { destino: 'Japón', valor_fob_usd: 2200000, share_pct: 17.6, delta_pct: -3.4 },
      { destino: 'Rusia', valor_fob_usd: 1500000, share_pct: 12.0, delta_pct: 22.5 },
      { destino: 'Brasil', valor_fob_usd: 700000, share_pct: 5.6, delta_pct: -8.2 },
      { destino: 'España', valor_fob_usd: 500000, share_pct: 4.0, delta_pct: 6.3 },
    ]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(marketShare), 'MarketShare')

    const calibres = [
      { calibre: 'S', volumen_kg: 850000, precio_fob_usd: 2.45, delta_pct: 5.2 },
      { calibre: 'M', volumen_kg: 1450000, precio_fob_usd: 2.92, delta_pct: 11.4 },
      { calibre: 'L', volumen_kg: 1100000, precio_fob_usd: 3.38, delta_pct: 14.8 },
      { calibre: 'XL', volumen_kg: 600000, precio_fob_usd: 4.15, delta_pct: 18.3 },
      { calibre: 'XXL', volumen_kg: 200000, precio_fob_usd: 5.20, delta_pct: 9.1 },
    ]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(calibres), 'Calibres')

    const resumen = [
      ['Resumen ejecutivo del mes:'],
      [''],
      ['El mercado de exportación mantuvo un crecimiento estable en valor FOB total (+8.4%), impulsado principalmente por la consolidación de calibres XL en destinos asiáticos.'],
      [''],
      ['China continúa como destino dominante con 36% de share, creciendo 15.2% vs. periodo anterior. Rusia muestra el mayor crecimiento porcentual (+22.5%), oportunidad estratégica para el siguiente trimestre.'],
      [''],
      ['Camanchaca consolidó su liderazgo con 25.6% de market share. Atención al desempeño de Blumar (-4.3%), que abre espacio competitivo en el segmento medio.'],
    ]
    const resumenSheet = XLSX.utils.aoa_to_sheet(resumen)
    XLSX.utils.book_append_sheet(wb, resumenSheet, 'Resumen')

    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer

    return new Response(new Uint8Array(buf), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="qsa-plantilla-informe.xlsx"',
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    return handleError(err)
  }
}
