import type { WeatherVariable } from '../types/weather'

export const VARIABLE_META: Record<WeatherVariable, { label: string; unit: string; description: string }> = {
  temperature: { label: 'Temperatura', unit: '°C', description: 'Temperatura instantânea do ar.' },
  temperatureMin: { label: 'Temperatura mínima', unit: '°C', description: 'Menor temperatura no período da observação.' },
  temperatureMax: { label: 'Temperatura máxima', unit: '°C', description: 'Maior temperatura no período da observação.' },
  humidity: { label: 'Umidade relativa', unit: '%', description: 'Umidade relativa instantânea do ar.' },
  pressure: { label: 'Pressão atmosférica', unit: 'hPa', description: 'Pressão atmosférica instantânea.' },
  precipitation: { label: 'Precipitação', unit: 'mm', description: 'Chuva acumulada no intervalo da medição.' },
  windSpeed: { label: 'Velocidade do vento', unit: 'm/s', description: 'Velocidade do vento informada pela estação.' },
  windGust: { label: 'Rajada máxima', unit: 'm/s', description: 'Maior rajada registrada no período.' },
  windDirection: { label: 'Direção do vento', unit: '°', description: 'Direção de origem do vento.' },
  dewPoint: { label: 'Ponto de orvalho', unit: '°C', description: 'Temperatura em que o vapor começa a condensar.' },
  solarRadiation: { label: 'Radiação solar', unit: 'kJ/m²', description: 'Energia solar global acumulada no período.' },
}

export const WEATHER_VARIABLES = Object.keys(VARIABLE_META) as WeatherVariable[]
