export type StationSource = 'PROPRIA' | 'INMET'

export interface EstacaoINMET {
  UF: string
  CODIGO: string
  LONGITUDE: string | number | null
  REGIAO: string
  DISTANCIA_EM_KM?: string | number | null
  NOME: string
  LATITUDE: string | number | null
  GEOCODE?: string | null
}

export interface DadosMeteorologicosINMET {
  DC_NOME?: string | null
  PRE_INS?: string | number | null
  TEM_SEN?: string | number | null
  VL_LATITUDE?: string | number | null
  PRE_MAX?: string | number | null
  UF?: string | null
  RAD_GLO?: string | number | null
  PTO_INS?: string | number | null
  TEM_MIN?: string | number | null
  VL_LONGITUDE?: string | number | null
  UMD_MIN?: string | number | null
  PTO_MAX?: string | number | null
  VEN_DIR?: string | number | null
  DT_MEDICAO?: string | null
  CHUVA?: string | number | null
  PRE_MIN?: string | number | null
  UMD_MAX?: string | number | null
  VEN_VEL?: string | number | null
  PTO_MIN?: string | number | null
  TEM_MAX?: string | number | null
  TEN_BAT?: string | number | null
  VEN_RAJ?: string | number | null
  TEM_CPU?: string | number | null
  TEM_INS?: string | number | null
  UMD_INS?: string | number | null
  CD_ESTACAO?: string | null
  HR_MEDICAO?: string | number | null
}

export interface RespostaINMET {
  estacao: EstacaoINMET
  dados: DadosMeteorologicosINMET | DadosMeteorologicosINMET[]
}

export interface ObservacaoMeteorologica {
  stationId: string
  stationName: string
  source: StationSource
  observedAtUtc: string
  temperature?: number
  temperatureMin?: number
  temperatureMax?: number
  feelsLike?: number
  humidity?: number
  humidityMin?: number
  humidityMax?: number
  pressure?: number
  pressureMin?: number
  pressureMax?: number
  precipitation?: number
  windSpeed?: number
  windGust?: number
  windDirection?: number
  dewPoint?: number
  dewPointMin?: number
  dewPointMax?: number
  solarRadiation?: number
  batteryVoltage?: number
  cpuTemperature?: number
  latitude?: number
  longitude?: number
}

export interface EstacaoNormalizada {
  id: string
  name: string
  code: string
  source: StationSource
  municipality?: string
  uf?: string
  region?: string
  geocode?: string
  latitude?: number
  longitude?: number
  altitude?: number
  status?: string
  lastCommunication?: string
  referenceStation?: string
  distanceKm?: number
}

export type WeatherVariable =
  | 'temperature'
  | 'temperatureMin'
  | 'temperatureMax'
  | 'humidity'
  | 'pressure'
  | 'precipitation'
  | 'windSpeed'
  | 'windGust'
  | 'windDirection'
  | 'dewPoint'
  | 'solarRadiation'

export interface ComparisonRow {
  id: string
  ownAt: string
  inmetAt?: string
  ownValue?: number
  inmetValue?: number
  difference?: number
  percentDifference?: number
  unit: string
  status: 'correspondente' | 'sem-correspondencia' | 'dado-ausente'
  delayMinutes?: number
}

export interface ComparisonStats {
  pairs: number
  meanDifference?: number
  mae?: number
  rmse?: number
  maxDifference?: number
  availabilityPercent: number
  averageDelayMinutes?: number
  bias?: number
}
