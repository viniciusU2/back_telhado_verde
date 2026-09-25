import { mockInmetResponse } from '../mocks/inmet-response'
import type { DadosMeteorologicosINMET, EstacaoINMET, ObservacaoMeteorologica, RespostaINMET } from '../types/weather'
import { combineInmetDateTime } from '../utils/date'
import { boundedNumber, coherentRange, safeNumber } from '../utils/number'
import { coordinatesAreValid } from '../utils/geo'
import { requestJson } from './http'

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function validateResponse(value: unknown): RespostaINMET {
  if (!isObject(value) || !isObject(value.estacao) || (!isObject(value.dados) && !Array.isArray(value.dados))) {
    throw new Error('Resposta INMET inválida: eram esperados os objetos "estacao" e "dados".')
  }
  const station = value.estacao as unknown as EstacaoINMET
  if (!station.CODIGO || !station.NOME) throw new Error('Resposta INMET inválida: a estação não possui código ou nome.')
  return value as unknown as RespostaINMET
}

export function mapINMETToObservacao(data: DadosMeteorologicosINMET, station: EstacaoINMET): ObservacaoMeteorologica {
  const observedAtUtc = combineInmetDateTime(data.DT_MEDICAO, data.HR_MEDICAO)
  if (!observedAtUtc) throw new Error('Resposta INMET inválida: data ou hora da medição não pôde ser interpretada.')

  const latitude = boundedNumber(data.VL_LATITUDE ?? station.LATITUDE, -90, 90, 'latitude')
  const longitude = boundedNumber(data.VL_LONGITUDE ?? station.LONGITUDE, -180, 180, 'longitude')
  if (!coordinatesAreValid(latitude, longitude) && import.meta.env.DEV) console.warn('[dados] Coordenadas INMET inválidas')

  const observation: ObservacaoMeteorologica = {
    stationId: String(data.CD_ESTACAO || station.CODIGO),
    stationName: String(data.DC_NOME || station.NOME),
    source: 'INMET',
    observedAtUtc,
    temperature: safeNumber(data.TEM_INS, 'TEM_INS'),
    temperatureMin: safeNumber(data.TEM_MIN, 'TEM_MIN'),
    temperatureMax: safeNumber(data.TEM_MAX, 'TEM_MAX'),
    feelsLike: safeNumber(data.TEM_SEN, 'TEM_SEN'),
    humidity: boundedNumber(data.UMD_INS, 0, 100, 'UMD_INS'),
    humidityMin: boundedNumber(data.UMD_MIN, 0, 100, 'UMD_MIN'),
    humidityMax: boundedNumber(data.UMD_MAX, 0, 100, 'UMD_MAX'),
    pressure: safeNumber(data.PRE_INS, 'PRE_INS'),
    pressureMin: safeNumber(data.PRE_MIN, 'PRE_MIN'),
    pressureMax: safeNumber(data.PRE_MAX, 'PRE_MAX'),
    precipitation: safeNumber(data.CHUVA, 'CHUVA'),
    windSpeed: safeNumber(data.VEN_VEL, 'VEN_VEL'),
    windGust: safeNumber(data.VEN_RAJ, 'VEN_RAJ'),
    windDirection: boundedNumber(data.VEN_DIR, 0, 360, 'VEN_DIR'),
    dewPoint: safeNumber(data.PTO_INS, 'PTO_INS'),
    dewPointMin: safeNumber(data.PTO_MIN, 'PTO_MIN'),
    dewPointMax: safeNumber(data.PTO_MAX, 'PTO_MAX'),
    solarRadiation: safeNumber(data.RAD_GLO, 'RAD_GLO'),
    batteryVoltage: safeNumber(data.TEN_BAT, 'TEN_BAT'),
    cpuTemperature: safeNumber(data.TEM_CPU, 'TEM_CPU'),
    latitude,
    longitude,
  }

  coherentRange(observation.temperatureMin, observation.temperature, observation.temperatureMax)
  coherentRange(observation.humidityMin, observation.humidity, observation.humidityMax)
  coherentRange(observation.pressureMin, observation.pressure, observation.pressureMax)
  return observation
}

export interface INMETDataSet {
  station: EstacaoINMET
  observations: ObservacaoMeteorologica[]
}

export function normalizeINMETResponse(value: unknown): INMETDataSet {
  const response = validateResponse(value)
  const raw = Array.isArray(response.dados) ? response.dados : [response.dados]
  const observations = raw.map((item) => mapINMETToObservacao(item, response.estacao)).sort((a, b) => a.observedAtUtc.localeCompare(b.observedAtUtc))
  return { station: response.estacao, observations }
}

export async function fetchINMETData(): Promise<INMETDataSet | null> {
  const url = import.meta.env.VITE_INMET_API_URL?.trim()
  if (!url) {
    if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_DATA === 'true') return normalizeINMETResponse(mockInmetResponse)
    return null
  }
  return normalizeINMETResponse(await requestJson<unknown>(url))
}
