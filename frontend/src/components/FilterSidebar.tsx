import { Filter, RotateCcw } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useEffect, useState, type ReactNode } from 'react'
import type { ApiDispositivo } from '../types/api'
import type { WeatherVariable } from '../types/weather'
import { VARIABLE_META } from '../utils/variables'
import { Button } from './ui'
import type { DashboardFilters } from './FilterBar'

const OWN_STATION_VARIABLES: WeatherVariable[] = ['temperature', 'humidity']

export function FilterSidebar({ devices, filters, onChange, onApply, onClear }: {
  devices: ApiDispositivo[]
  filters: DashboardFilters
  onChange: (filters: DashboardFilters) => void
  onApply: () => void
  onClear: () => void
}) {
  const [target, setTarget] = useState<HTMLElement | null>(null)
  useEffect(() => setTarget(document.getElementById('sidebar-filters')), [])
  const set = <K extends keyof DashboardFilters>(key: K, value: DashboardFilters[K]) => onChange({ ...filters, [key]: value })
  if (!target) return null

  return createPortal(<section aria-label="Filtros da comparação">
    <div className="mb-4 flex items-center gap-2 text-brand-700"><Filter size={17} /><div><h2 className="text-sm font-bold">Filtros da comparação</h2><p className="mt-0.5 text-[11px] font-normal text-slate-400">Temperatura e umidade</p></div></div>
    <div className="space-y-3.5">
      <Field label="Estação própria"><select value={filters.deviceId ?? ''} onChange={(event) => set('deviceId', event.target.value ? Number(event.target.value) : null)}><option value="">Selecione</option>{devices.map((device) => <option key={device.id} value={device.id}>{device.nome}</option>)}</select></Field>
      <Field label="Referência INMET"><input value="Configurada pela API" disabled /></Field>
      <Field label="Período inicial"><input type="date" value={filters.startDate} onChange={(event) => set('startDate', event.target.value)} /></Field>
      <Field label="Período final"><input type="date" value={filters.endDate} onChange={(event) => set('endDate', event.target.value)} /></Field>
      <Field label="Variável"><select value={filters.variable} onChange={(event) => set('variable', event.target.value as WeatherVariable)}>{OWN_STATION_VARIABLES.map((variable) => <option key={variable} value={variable}>{VARIABLE_META[variable].label}</option>)}</select></Field>
      <Field label="Agregação"><select value={filters.aggregation} onChange={(event) => set('aggregation', event.target.value as DashboardFilters['aggregation'])}><option value="raw">Sem agregação</option><option value="hour">Hora</option><option value="day">Dia</option><option value="week">Semana</option><option value="month">Mês</option></select></Field>
      <Field label="Tolerância"><select value={filters.toleranceMinutes} onChange={(event) => set('toleranceMinutes', Number(event.target.value))}><option value={5}>5 minutos</option><option value={10}>10 minutos</option><option value={15}>15 minutos</option><option value={30}>30 minutos</option></select></Field>
      <Button onClick={onApply} className="w-full bg-brand-600 text-white hover:bg-brand-700">Aplicar filtros</Button>
      <Button onClick={onClear} className="w-full bg-slate-100 text-slate-600 hover:bg-slate-200"><RotateCcw size={15} />Limpar filtros</Button>
    </div>
  </section>, target)
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-[11px] font-semibold text-slate-500">{label}<div className="mt-1.5 [&>*]:h-9 [&>*]:w-full [&>*]:min-w-0 [&>*]:rounded-xl [&>*]:border [&>*]:border-line [&>*]:bg-white [&>*]:px-2.5 [&>*]:text-xs [&>*]:text-ink [&>*]:outline-none focus-within:[&>*]:border-brand-500 focus-within:[&>*]:ring-2 focus-within:[&>*]:ring-brand-100">{children}</div></label>
}
