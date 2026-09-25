import { format, isValid, parse } from 'date-fns'
import { fromZonedTime, toZonedTime } from 'date-fns-tz'
import { ptBR } from 'date-fns/locale'

export const STATION_TIMEZONE = import.meta.env.VITE_STATION_TIMEZONE || 'America/Bahia'

export function combineInmetDateTime(date?: string | null, hour?: string | number | null): string | undefined {
  if (!date || hour === null || hour === undefined) return undefined
  const normalizedHour = String(hour).padStart(4, '0')
  if (!/^\d{4}$/.test(normalizedHour)) return undefined
  const parsed = parse(`${date} ${normalizedHour}`, 'yyyy-MM-dd HHmm', new Date())
  if (!isValid(parsed)) return undefined
  return fromZonedTime(parsed, 'UTC').toISOString()
}

export function normalizeApiUtc(value?: string): string | undefined {
  if (!value) return undefined
  const hasZone = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(value)
  const parsed = new Date(hasZone ? value : `${value}Z`)
  return isValid(parsed) ? parsed.toISOString() : undefined
}

export function formatStationDateTime(iso?: string, pattern = "dd 'de' MMM, HH:mm"): string {
  if (!iso) return 'Horário indisponível'
  const date = new Date(iso)
  if (!isValid(date)) return 'Horário indisponível'
  return format(toZonedTime(date, STATION_TIMEZONE), pattern, { locale: ptBR })
}

export function formatUtcDateTime(iso?: string): string {
  if (!iso) return 'UTC indisponível'
  const date = new Date(iso)
  if (!isValid(date)) return 'UTC indisponível'
  return `${format(toZonedTime(date, 'UTC'), 'dd/MM/yyyy HH:mm')} UTC`
}

export function ageInMinutes(iso?: string): number | undefined {
  if (!iso) return undefined
  const time = new Date(iso).getTime()
  return Number.isFinite(time) ? Math.max(0, Math.floor((Date.now() - time) / 60_000)) : undefined
}
