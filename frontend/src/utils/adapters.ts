import type { ApiDispositivo, ApiLeitura } from '../types/api'
import type { ObservacaoMeteorologica, WeatherVariable } from '../types/weather'
import { normalizeApiUtc } from './date'
import { boundedNumber, safeNumber } from './number'

const TYPE_MAP: Record<string, WeatherVariable> = {
  temperatura: 'temperature', temperature: 'temperature', tem_ins: 'temperature',
  temperatura_minima: 'temperatureMin', tem_min: 'temperatureMin',
  temperatura_maxima: 'temperatureMax', tem_max: 'temperatureMax',
  umidade: 'humidity', humidity: 'humidity', umd_ins: 'humidity',
  pressao: 'pressure', pressão: 'pressure', pressure: 'pressure', pre_ins: 'pressure',
  chuva: 'precipitation', precipitacao: 'precipitation', precipitação: 'precipitation',
  vento: 'windSpeed', velocidade_vento: 'windSpeed', ven_vel: 'windSpeed',
  rajada: 'windGust', ven_raj: 'windGust', direcao_vento: 'windDirection', ven_dir: 'windDirection',
  ponto_orvalho: 'dewPoint', pto_ins: 'dewPoint', radiacao: 'solarRadiation', rad_glo: 'solarRadiation',
}

export function mapReadingType(type: string): WeatherVariable | undefined {
  return TYPE_MAP[type.trim().toLowerCase().replace(/\s+/g, '_')]
}

export function mapEstacaoPropriaToObservacao(
  device: ApiDispositivo,
  readings: ApiLeitura[],
): ObservacaoMeteorologica[] {
  const byTimestamp = new Map<string, ObservacaoMeteorologica>()

  readings
    .filter((reading) => reading.id_dispositivo === device.id)
    .forEach((reading) => {
      const observedAtUtc = normalizeApiUtc(reading.criado_em)
      const variable = mapReadingType(reading.tipo)
      if (!observedAtUtc || !variable) {
        if (import.meta.env.DEV) console.warn('[dados] Leitura própria ignorada por tipo ou data inválidos:', reading)
        return
      }
      const timestamp = observedAtUtc.slice(0, 16)
      const observation = byTimestamp.get(timestamp) || {
        stationId: String(device.id), stationName: device.nome, source: 'PROPRIA' as const,
        observedAtUtc, latitude: device.latitude, longitude: device.longitude,
      }
      const value = variable === 'humidity' ? boundedNumber(reading.valor, 0, 100, reading.tipo) :
        variable === 'windDirection' ? boundedNumber(reading.valor, 0, 360, reading.tipo) : safeNumber(reading.valor, reading.tipo)
      if (value !== undefined) Object.assign(observation, { [variable]: value })
      byTimestamp.set(timestamp, observation)
    })

  return [...byTimestamp.values()].sort((a, b) => a.observedAtUtc.localeCompare(b.observedAtUtc))
}
