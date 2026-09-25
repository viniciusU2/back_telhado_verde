import type { ObservacaoMeteorologica, WeatherVariable } from '../types/weather'

export type AggregationInterval = 'raw' | 'hour' | 'day' | 'week' | 'month'

export function aggregateObservations(observations: ObservacaoMeteorologica[], variable: WeatherVariable, interval: AggregationInterval): ObservacaoMeteorologica[] {
  if (interval === 'raw') return observations
  const groups = new Map<string, ObservacaoMeteorologica[]>()
  observations.forEach((observation) => {
    const date = new Date(observation.observedAtUtc)
    let key = observation.observedAtUtc.slice(0, 13)
    if (interval === 'day') key = observation.observedAtUtc.slice(0, 10)
    if (interval === 'month') key = observation.observedAtUtc.slice(0, 7)
    if (interval === 'week') key = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - ((date.getUTCDay() + 6) % 7))).toISOString().slice(0, 10)
    groups.set(key, [...(groups.get(key) || []), observation])
  })
  return [...groups.values()].map((items) => {
    const values = items.map((item) => item[variable]).filter((value): value is number => typeof value === 'number')
    let value: number | undefined
    if (values.length) {
      if (variable === 'precipitation' || variable === 'solarRadiation') value = values.reduce((sum, item) => sum + item, 0)
      else if (variable === 'temperatureMin') value = Math.min(...values)
      else if (variable === 'temperatureMax' || variable === 'windGust') value = Math.max(...values)
      else value = values.reduce((sum, item) => sum + item, 0) / values.length
    }
    return { ...items[0], [variable]: value }
  })
}
