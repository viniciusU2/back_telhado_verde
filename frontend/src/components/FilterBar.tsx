import { Filter, RotateCcw } from 'lucide-react'
import type { ApiDispositivo } from '../types/api'
import type { WeatherVariable } from '../types/weather'
import { WEATHER_VARIABLES, VARIABLE_META } from '../utils/variables'
import { Button, Card } from './ui'

export interface DashboardFilters {
  deviceId: number | null
  variable: WeatherVariable
  startDate: string
  endDate: string
  aggregation: 'raw' | 'hour' | 'day' | 'week' | 'month'
  toleranceMinutes: number
}

export function FilterBar({ devices, filters, onChange, onApply, onClear }: { devices: ApiDispositivo[]; filters: DashboardFilters; onChange: (filters: DashboardFilters) => void; onApply: () => void; onClear: () => void }) {
  const set = <K extends keyof DashboardFilters>(key: K, value: DashboardFilters[K]) => onChange({ ...filters, [key]: value })
  return <Card className="mb-6 p-4 lg:p-5"><div className="mb-4 flex items-center gap-2"><Filter size={17} className="text-brand-600" /><h2 className="text-sm font-bold">Filtros da comparação</h2></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
    <Field label="Estação própria"><select value={filters.deviceId ?? ''} onChange={(event) => set('deviceId', event.target.value ? Number(event.target.value) : null)}><option value="">Selecione</option>{devices.map((device) => <option key={device.id} value={device.id}>{device.nome}</option>)}</select></Field>
    <Field label="Referência INMET"><input value="Configurada pela API" disabled /></Field>
    <Field label="Período inicial"><input type="date" value={filters.startDate} onChange={(event) => set('startDate', event.target.value)} /></Field>
    <Field label="Período final"><input type="date" value={filters.endDate} onChange={(event) => set('endDate', event.target.value)} /></Field>
    <Field label="Variável"><select value={filters.variable} onChange={(event) => set('variable', event.target.value as WeatherVariable)}>{WEATHER_VARIABLES.map((variable) => <option key={variable} value={variable}>{VARIABLE_META[variable].label}</option>)}</select></Field>
    <Field label="Agregação"><select value={filters.aggregation} onChange={(event) => set('aggregation', event.target.value as DashboardFilters['aggregation'])}><option value="raw">Sem agregação</option><option value="hour">Hora</option><option value="day">Dia</option><option value="week">Semana</option><option value="month">Mês</option></select></Field>
    <Field label="Tolerância"><select value={filters.toleranceMinutes} onChange={(event) => set('toleranceMinutes', Number(event.target.value))}><option value={5}>5 minutos</option><option value={10}>10 minutos</option><option value={15}>15 minutos</option><option value={30}>30 minutos</option></select></Field>
  </div><div className="mt-4 flex flex-wrap gap-2"><Button onClick={onApply} className="bg-brand-600 text-white hover:bg-brand-700">Aplicar filtros</Button><Button onClick={onClear} className="bg-slate-100 text-slate-600 hover:bg-slate-200"><RotateCcw size={15} />Limpar filtros</Button></div></Card>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="text-xs font-semibold text-slate-500">{label}<div className="mt-1.5 [&>*]:h-10 [&>*]:w-full [&>*]:rounded-xl [&>*]:border [&>*]:border-line [&>*]:bg-white [&>*]:px-3 [&>*]:text-sm [&>*]:text-ink [&>*]:outline-none focus-within:[&>*]:border-brand-500 focus-within:[&>*]:ring-2 focus-within:[&>*]:ring-brand-100">{children}</div></label> }
