import { CloudRain, Droplets, Gauge, Navigation, Sun, Thermometer, Wind } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ObservacaoMeteorologica } from '../types/weather'
import { formatValue, metersPerSecondToKmPerHour } from '../utils/number'
import { degreesToCardinal } from '../utils/wind'
import { Card, Tooltip } from './ui'

interface MetricDefinition {
  label: string; key: keyof ObservacaoMeteorologica; unit: string; icon: LucideIcon; description: string
}

const metrics: MetricDefinition[] = [
  { label: 'Umidade relativa', key: 'humidity', unit: '%', icon: Droplets, description: 'Umidade relativa instantânea do ar.' },
  { label: 'Precipitação', key: 'precipitation', unit: 'mm', icon: CloudRain, description: 'Chuva acumulada no intervalo da medição.' },
  { label: 'Pressão atmosférica', key: 'pressure', unit: 'hPa', icon: Gauge, description: 'Pressão atmosférica instantânea.' },
  { label: 'Velocidade do vento', key: 'windSpeed', unit: 'm/s', icon: Wind, description: 'Velocidade instantânea ou média informada pela estação.' },
  { label: 'Rajada máxima', key: 'windGust', unit: 'm/s', icon: Navigation, description: 'Maior velocidade de rajada registrada no período.' },
  { label: 'Ponto de orvalho', key: 'dewPoint', unit: '°C', icon: Thermometer, description: 'Temperatura em que o vapor de água começa a condensar.' },
  { label: 'Radiação solar', key: 'solarRadiation', unit: 'kJ/m²', icon: Sun, description: 'Energia solar global acumulada no período.' },
]

export function MetricCards({ observation }: { observation?: ObservacaoMeteorologica }) {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <MetricCard key={metric.key} metric={metric} observation={observation} />)}</div>
}

function MetricCard({ metric, observation }: { metric: MetricDefinition; observation?: ObservacaoMeteorologica }) {
  const raw = observation?.[metric.key]
  const value = typeof raw === 'number' ? raw : undefined
  const wind = metric.key === 'windSpeed' || metric.key === 'windGust'
  return (
    <Card className="group p-5 transition hover:-translate-y-0.5 hover:border-brand-100">
      <div className="flex items-start justify-between"><div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-brand-50 group-hover:text-brand-600"><metric.icon size={20} /></div><Tooltip text={metric.description} /></div>
      <p className="mt-5 text-sm font-medium text-slate-500">{metric.label}</p>
      {value === undefined ? <p className="mt-1 text-sm font-semibold text-slate-400">Dado indisponível</p> : <div className="mt-1 flex items-baseline gap-1.5"><span className="text-2xl font-bold tracking-tight">{formatValue(value)}</span><span className="text-sm font-semibold text-slate-400">{metric.unit}</span></div>}
      {wind && value !== undefined && <p className="mt-2 text-xs text-slate-400">{formatValue(metersPerSecondToKmPerHour(value))} km/h</p>}
    </Card>
  )
}

export function TemperatureHero({ observation, ownObservation }: { observation?: ObservacaoMeteorologica; ownObservation?: ObservacaoMeteorologica }) {
  const source = observation?.source === 'INMET' ? 'INMET' : 'PRÓPRIA'
  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#173d35] to-[#0f6c58] p-6 text-white sm:p-7">
      <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full border-[28px] border-white/5" />
      <div className="relative flex h-full flex-col justify-between gap-8">
        <div className="flex items-start justify-between"><div><span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold tracking-wider">{source}</span><p className="mt-4 text-sm text-white/60">Temperatura atual</p><div className="mt-1 flex items-start"><span className="text-6xl font-semibold tracking-[-.06em]">{formatValue(observation?.temperature)}</span><span className="mt-2 text-xl text-white/60">°C</span></div></div><Thermometer size={28} className="text-white/60" /></div>
        <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-sm"><HeroStat label="Sensação" value={observation?.feelsLike} /><HeroStat label="Mínima" value={observation?.temperatureMin} /><HeroStat label="Máxima" value={observation?.temperatureMax} /></div>
        {observation?.source === 'INMET' && ownObservation?.temperature !== undefined && observation.temperature !== undefined && <p className="rounded-xl bg-white/10 px-3 py-2 text-xs text-white/75">Própria {formatValue(ownObservation.temperature)} °C · diferença {formatValue(ownObservation.temperature - observation.temperature)} °C</p>}
      </div>
    </Card>
  )
}

function HeroStat({ label, value }: { label: string; value?: number }) { return <div><p className="text-white/55">{label}</p><p className="mt-1 font-semibold">{value === undefined ? '—' : `${formatValue(value)} °C`}</p></div> }

export function WindCompass({ observation }: { observation?: ObservacaoMeteorologica }) {
  const cardinal = degreesToCardinal(observation?.windDirection)
  return <Card className="flex min-h-56 items-center justify-between gap-4 p-6"><div><p className="text-sm font-semibold text-slate-500">Direção do vento</p><p className="mt-2 text-2xl font-bold">{cardinal ? `${cardinal.label} — ${formatValue(observation?.windDirection, 0)}°` : 'Dado indisponível'}</p><p className="mt-2 text-sm text-slate-400">{formatValue(observation?.windSpeed)} m/s · {formatValue(metersPerSecondToKmPerHour(observation?.windSpeed))} km/h</p></div><div className="relative grid h-28 w-28 shrink-0 place-items-center rounded-full border border-line bg-slate-50"><span className="absolute top-2 text-[10px] font-bold text-slate-400">N</span><Navigation className="text-brand-600 transition-transform" size={42} style={{ transform: `rotate(${observation?.windDirection || 0}deg)` }} aria-label={cardinal ? `Vento de ${cardinal.label}` : 'Direção indisponível'} /></div></Card>
}
