import { Droplets, MapPin, Thermometer } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ObservacaoMeteorologica, WeatherVariable } from '../types/weather'
import { haversineDistanceKm } from '../utils/geo'
import { formatValue } from '../utils/number'
import { VARIABLE_META } from '../utils/variables'
import { Card } from './ui'

const summaries: { variable: WeatherVariable; icon: LucideIcon }[] = [
  { variable: 'temperature', icon: Thermometer },
  { variable: 'humidity', icon: Droplets },
]

export function ComparisonSummary({ own, inmet, apiDistance }: { own?: ObservacaoMeteorologica; inmet?: ObservacaoMeteorologica; apiDistance?: number }) {
  const distance = apiDistance ?? haversineDistanceKm(own?.latitude, own?.longitude, inmet?.latitude, inmet?.longitude)
  return <div className="mb-6 grid gap-3 sm:grid-cols-3">{summaries.map(({ variable, icon: Icon }) => {
    const ownValue = own?.[variable] as number | undefined
    const inmetValue = inmet?.[variable] as number | undefined
    const difference = ownValue !== undefined && inmetValue !== undefined ? ownValue - inmetValue : undefined
    const meta = VARIABLE_META[variable]
    return <Card key={variable} className="p-4"><div className="flex items-center gap-2 text-slate-500"><Icon size={16} /><p className="truncate text-xs font-semibold">{meta.label}</p></div><p className="mt-3 text-lg font-bold">{formatValue(ownValue)} <span className="text-xs font-medium text-slate-400">{meta.unit}</span></p><div className="mt-2 space-y-1 text-[11px] text-slate-500"><p>INMET <b className="text-slate-700">{formatValue(inmetValue)} {meta.unit}</b></p><p>Diferença <b className={difference !== undefined && Math.abs(difference) > 5 ? 'text-amber-600' : 'text-slate-700'}>{difference === undefined ? '—' : `${difference > 0 ? '+' : ''}${formatValue(difference)} ${variable === 'humidity' ? 'p.p.' : meta.unit}`}</b></p></div></Card>
  })}<Card className="p-4"><div className="flex items-center gap-2 text-slate-500"><MapPin size={16} /><p className="text-xs font-semibold">Distância INMET</p></div><p className="mt-3 text-lg font-bold">{formatValue(distance)} <span className="text-xs font-medium text-slate-400">km</span></p><p className="mt-2 text-[11px] leading-relaxed text-slate-400">Informativa; não define qualidade da comparação.</p></Card></div>
}
