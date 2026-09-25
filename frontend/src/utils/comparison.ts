import type { ComparisonRow, ComparisonStats, ObservacaoMeteorologica, WeatherVariable } from '../types/weather'
import { VARIABLE_META } from './variables'

export function compareObservations(
  own: ObservacaoMeteorologica[],
  inmet: ObservacaoMeteorologica[],
  variable: WeatherVariable,
  toleranceMinutes = 5,
): ComparisonRow[] {
  const toleranceMs = toleranceMinutes * 60_000
  return own.map((observation, index) => {
    const ownValue = observation[variable] as number | undefined
    const ownTime = new Date(observation.observedAtUtc).getTime()
    const closest = inmet.reduce<{ item?: ObservacaoMeteorologica; delta: number }>((best, candidate) => {
      const delta = Math.abs(new Date(candidate.observedAtUtc).getTime() - ownTime)
      return delta < best.delta ? { item: candidate, delta } : best
    }, { delta: Number.POSITIVE_INFINITY })

    if (!closest.item || closest.delta > toleranceMs) {
      return { id: `${observation.observedAtUtc}-${index}`, ownAt: observation.observedAtUtc, ownValue,
        unit: VARIABLE_META[variable].unit, status: ownValue === undefined ? 'dado-ausente' : 'sem-correspondencia' }
    }
    const inmetValue = closest.item[variable] as number | undefined
    if (ownValue === undefined || inmetValue === undefined) {
      return { id: `${observation.observedAtUtc}-${index}`, ownAt: observation.observedAtUtc,
        inmetAt: closest.item.observedAtUtc, ownValue, inmetValue, unit: VARIABLE_META[variable].unit, status: 'dado-ausente' }
    }
    const difference = ownValue - inmetValue
    return {
      id: `${observation.observedAtUtc}-${index}`,
      ownAt: observation.observedAtUtc,
      inmetAt: closest.item.observedAtUtc,
      ownValue,
      inmetValue,
      difference,
      percentDifference: inmetValue === 0 ? undefined : (difference / Math.abs(inmetValue)) * 100,
      unit: VARIABLE_META[variable].unit,
      status: 'correspondente',
      delayMinutes: closest.delta / 60_000,
    }
  })
}

export function calculateComparisonStats(rows: ComparisonRow[]): ComparisonStats {
  const matched = rows.filter((row) => row.status === 'correspondente' && row.difference !== undefined)
  const differences = matched.map((row) => row.difference!)
  const bias = differences.length ? differences.reduce((sum, value) => sum + value, 0) / differences.length : undefined
  return {
    pairs: matched.length,
    meanDifference: bias,
    bias,
    mae: differences.length ? differences.reduce((sum, value) => sum + Math.abs(value), 0) / differences.length : undefined,
    rmse: differences.length ? Math.sqrt(differences.reduce((sum, value) => sum + value ** 2, 0) / differences.length) : undefined,
    maxDifference: differences.length ? Math.max(...differences.map(Math.abs)) : undefined,
    availabilityPercent: rows.length ? (matched.length / rows.length) * 100 : 0,
    averageDelayMinutes: matched.length ? matched.reduce((sum, row) => sum + (row.delayMinutes || 0), 0) / matched.length : undefined,
  }
}
