const INVALID_MARKERS = new Set(['', 'null', 'undefined', 'nan', '-9999'])

export function safeNumber(value: unknown, field = 'valor'): number | undefined {
  if (value === null || value === undefined) return undefined
  if (typeof value === 'string' && INVALID_MARKERS.has(value.trim().toLowerCase())) return undefined

  const parsed = typeof value === 'number' ? value : Number(String(value).trim().replace(',', '.'))
  if (!Number.isFinite(parsed)) {
    if (import.meta.env.DEV) console.warn(`[dados] ${field} inválido:`, value)
    return undefined
  }
  return parsed
}

export function boundedNumber(
  value: unknown,
  min: number,
  max: number,
  field: string,
): number | undefined {
  const parsed = safeNumber(value, field)
  if (parsed === undefined) return undefined
  if (parsed < min || parsed > max) {
    if (import.meta.env.DEV) console.warn(`[dados] ${field} fora do intervalo ${min}–${max}:`, parsed)
    return undefined
  }
  return parsed
}

export function metersPerSecondToKmPerHour(value?: number): number | undefined {
  return value === undefined ? undefined : value * 3.6
}

export function formatValue(value: number | undefined, maximumFractionDigits = 1): string {
  if (value === undefined) return 'Dado indisponível'
  return new Intl.NumberFormat('pt-BR', { maximumFractionDigits }).format(value)
}

export function coherentRange(min?: number, current?: number, max?: number): boolean {
  if (min === undefined || current === undefined || max === undefined) return true
  const valid = min <= current && current <= max
  if (!valid && import.meta.env.DEV) console.warn('[dados] Faixa mínimo/atual/máximo incoerente', { min, current, max })
  return valid
}
