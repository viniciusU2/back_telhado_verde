import { useMemo } from 'react'
import { AlertCircle } from 'lucide-react'
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from 'recharts'
import type { ComparisonRow, WeatherVariable } from '../types/weather'
import { formatStationDateTime } from '../utils/date'
import { formatValue } from '../utils/number'
import { VARIABLE_META } from '../utils/variables'
import { Card, EmptyState, Tooltip } from './ui'

interface ChartPoint { label: string; own?: number; inmet?: number; difference?: number }

export function ComparisonCharts({ rows, variable }: { rows: ComparisonRow[]; variable: WeatherVariable }) {
  const data = useMemo<ChartPoint[]>(() => rows.map((row) => ({
    label: formatStationDateTime(row.ownAt, 'dd/MM HH:mm'),
    own: finite(row.ownValue),
    inmet: finite(row.inmetValue),
    difference: finite(row.difference),
  })), [rows])
  const ownCount = data.filter((point) => point.own !== undefined).length
  const inmetCount = data.filter((point) => point.inmet !== undefined).length
  const differenceCount = data.filter((point) => point.difference !== undefined).length
  const meta = VARIABLE_META[variable]

  if (!ownCount) return <EmptyState title="Histórico próprio indisponível" description="Não existem medições da estação própria para a variável e o período selecionados." />

  return <div className="grid gap-5 xl:grid-cols-2">
    <Card className="min-w-0 p-5">
      <div className="mb-2 flex items-center justify-between"><div><h3 className="font-semibold">{meta.label} por fonte</h3><p className="mt-1 text-xs text-slate-400">{ownCount} pontos próprios · {inmetCount} pontos INMET</p></div><Tooltip text="Linha contínua: estação própria. Pontos ou linha tracejada: INMET." /></div>
      <WeatherChart data={data} unit={meta.unit} ownCount={ownCount} inmetCount={inmetCount} />
    </Card>

    {differenceCount >= 2 ? <Card className="min-w-0 p-5"><div className="mb-2 flex items-center justify-between"><div><h3 className="font-semibold">Desvio ao longo do tempo</h3><p className="mt-1 text-xs text-slate-400">{differenceCount} pares correspondentes</p></div><Tooltip text="Desvio = estação própria − INMET. Lacunas permanecem visíveis." /></div><DifferenceChart data={data} unit={meta.unit} /></Card> : <Card className="flex min-h-[348px] flex-col p-5"><div className="flex items-center justify-between"><h3 className="font-semibold">Desvio ao longo do tempo</h3><Tooltip text="O desvio exige medições das duas fontes em horários correspondentes." /></div><div className="flex flex-1 flex-col items-center justify-center px-6 text-center"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-50 text-amber-600"><AlertCircle size={21} /></span><p className="mt-4 text-sm font-semibold">Histórico INMET insuficiente</p><p className="mt-2 max-w-xs text-xs leading-relaxed text-slate-400">Há {differenceCount} {differenceCount === 1 ? 'par correspondente' : 'pares correspondentes'}. São necessários pelo menos dois pares para traçar a evolução do desvio.</p>{differenceCount === 1 && <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">Desvio disponível: <strong>{formatValue(data.find((point) => point.difference !== undefined)?.difference, 2)} {meta.unit}</strong></p>}</div></Card>}
  </div>
}

function WeatherChart({ data, unit, ownCount, inmetCount }: { data: ChartPoint[]; unit: string; ownCount: number; inmetCount: number }) {
  return <div className="h-72 w-full" aria-label="Histórico por fonte"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ top: 20, right: 12, left: -12, bottom: 0 }}><CartesianGrid stroke="#e9efec" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="label" tick={{ fill: '#82908a', fontSize: 11 }} minTickGap={28} axisLine={false} tickLine={false} /><YAxis tick={{ fill: '#82908a', fontSize: 11 }} axisLine={false} tickLine={false} width={54} unit={` ${unit}`} domain={['auto', 'auto']} /><RechartsTooltip contentStyle={{ borderRadius: 12, border: '1px solid #dfe7e3', boxShadow: '0 8px 30px rgba(0,0,0,.08)', fontSize: 12 }} formatter={(value: number) => [`${formatValue(value, 2)} ${unit}`]} /><Legend wrapperStyle={{ fontSize: 12, paddingTop: 14 }} /><Line type="monotone" dataKey="own" name="Estação própria" stroke="#16856c" strokeWidth={2.5} dot={ownCount === 1 ? { r: 4 } : false} activeDot={{ r: 4 }} connectNulls={false} isAnimationActive={false} /><Line type="monotone" dataKey="inmet" name="INMET" stroke="#3178c6" strokeWidth={2.5} strokeDasharray="6 5" dot={inmetCount <= 3 ? { r: 4, strokeWidth: 2, fill: '#fff' } : false} activeDot={{ r: 4 }} connectNulls={false} isAnimationActive={false} /></LineChart></ResponsiveContainer></div>
}

function DifferenceChart({ data, unit }: { data: ChartPoint[]; unit: string }) {
  return <div className="h-72 w-full" aria-label="Desvio ao longo do tempo"><ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ top: 20, right: 12, left: -12, bottom: 0 }}><CartesianGrid stroke="#e9efec" strokeDasharray="3 3" vertical={false} /><XAxis dataKey="label" tick={{ fill: '#82908a', fontSize: 11 }} minTickGap={28} axisLine={false} tickLine={false} /><YAxis tick={{ fill: '#82908a', fontSize: 11 }} axisLine={false} tickLine={false} width={54} unit={` ${unit}`} domain={['auto', 'auto']} /><ReferenceLine y={0} stroke="#9aa7a2" /><RechartsTooltip contentStyle={{ borderRadius: 12, border: '1px solid #dfe7e3', fontSize: 12 }} formatter={(value: number) => [`${formatValue(value, 2)} ${unit}`]} /><Line type="monotone" dataKey="difference" name="Desvio" stroke="#d97706" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} connectNulls={false} isAnimationActive={false} /></LineChart></ResponsiveContainer></div>
}

function finite(value?: number) { return typeof value === 'number' && Number.isFinite(value) ? value : undefined }
