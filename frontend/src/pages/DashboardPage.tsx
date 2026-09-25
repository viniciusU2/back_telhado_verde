import { AlertTriangle, Database, RefreshCw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ComparisonCharts } from '../components/ComparisonCharts'
import { ComparisonSummary } from '../components/ComparisonSummary'
import { ComparisonTable } from '../components/ComparisonTable'
import { DashboardHeader } from '../components/DashboardHeader'
import { FilterSidebar } from '../components/FilterSidebar'
import type { DashboardFilters } from '../components/FilterBar'
import { MetricCards, TemperatureHero, WindCompass } from '../components/MetricCards'
import { StationDetails } from '../components/StationDetails'
import { StationMap } from '../components/StationMap'
import { StatisticsCards } from '../components/StatisticsCards'
import { Badge, Button, Card, EmptyState, Skeleton } from '../components/ui'
import { useDevices, useINMET, useReadings } from '../hooks/useWeatherData'
import { mapEstacaoPropriaToObservacao } from '../utils/adapters'
import { aggregateObservations } from '../utils/aggregation'
import { calculateComparisonStats, compareObservations } from '../utils/comparison'
import { safeNumber } from '../utils/number'
import { VARIABLE_META } from '../utils/variables'

const today = new Date()
const weekAgo = new Date(today.getTime() - 7 * 86_400_000)
const isoDate = (date: Date) => date.toISOString().slice(0, 10)
const initialFilters: DashboardFilters = { deviceId: null, variable: 'temperature', startDate: isoDate(weekAgo), endDate: isoDate(today), aggregation: 'raw', toleranceMinutes: 5 }

export function DashboardPage({ onGoToStations }: { onGoToStations: () => void }) {
  const devicesQuery = useDevices()
  const readingsQuery = useReadings()
  const inmetQuery = useINMET()
  const [draft, setDraft] = useState(initialFilters)
  const [filters, setFilters] = useState(initialFilters)
  const devices = devicesQuery.data || []
  const selectedId = filters.deviceId ?? devices[0]?.id ?? null
  const selected = devices.find((device) => device.id === selectedId)
  const ownAll = useMemo(() => selected ? mapEstacaoPropriaToObservacao(selected, readingsQuery.data?.dados || []) : [], [selected, readingsQuery.data])
  const inmetAll = inmetQuery.data?.observations || []
  const insideRange = <T extends { observedAtUtc: string }>(items: T[]) => items.filter((item) => item.observedAtUtc.slice(0, 10) >= filters.startDate && item.observedAtUtc.slice(0, 10) <= filters.endDate)
  const ownFiltered = aggregateObservations(insideRange(ownAll), filters.variable, filters.aggregation)
  const inmetFiltered = aggregateObservations(insideRange(inmetAll), filters.variable, filters.aggregation)
  const rows = compareObservations(ownFiltered, inmetFiltered, filters.variable, filters.toleranceMinutes)
  const stats = calculateComparisonStats(rows)
  const ownLatest = ownAll.at(-1)
  const inmetLatest = inmetAll.at(-1)
  const primary = inmetLatest || ownLatest
  const loading = devicesQuery.isLoading || readingsQuery.isLoading || inmetQuery.isLoading
  const error = devicesQuery.error || readingsQuery.error || inmetQuery.error
  function refresh() { void devicesQuery.refetch(); void readingsQuery.refetch(); void inmetQuery.refetch() }
  function clear() { const next = { ...initialFilters, deviceId: devices[0]?.id ?? null }; setDraft(next); setFilters(next) }

  if (loading && !devicesQuery.data && !readingsQuery.data) return <DashboardSkeleton />
  return <>
    <FilterSidebar devices={devices} filters={{ ...draft, deviceId: draft.deviceId ?? selectedId }} onChange={setDraft} onApply={() => setFilters(draft)} onClear={clear} />
    <DashboardHeader device={selected} observation={primary} refreshing={devicesQuery.isFetching || readingsQuery.isFetching || inmetQuery.isFetching} onRefresh={refresh} />
    {error && <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"><span className="flex items-center gap-2"><AlertTriangle size={18} />{error.message}</span><Button onClick={refresh} className="bg-white text-red-700"><RefreshCw size={15} />Tentar novamente</Button></div>}
    {!inmetQuery.data && !inmetQuery.isError && <ContractNotice />}
    {!selected && !inmetLatest ? <EmptyState title="Sem dados para monitorar" description="Cadastre uma estação própria e configure a integração INMET para visualizar o dashboard." action={<Button onClick={onGoToStations} className="bg-brand-600 text-white">Cadastrar estação</Button>} /> : <>
      <ComparisonSummary own={ownLatest} inmet={inmetLatest} apiDistance={safeNumber(inmetQuery.data?.station.DISTANCIA_EM_KM)} />
      <div className="mb-6 grid gap-5 xl:grid-cols-[1.15fr_1fr]"><TemperatureHero observation={primary} ownObservation={ownLatest} /><WindCompass observation={primary} /></div>
      <MetricCards observation={primary} />
      <div className="my-8"><Badge tone="gray">{filters.aggregation === 'raw' ? 'SEM AGREGAÇÃO' : `AGREGAÇÃO: ${filters.aggregation.toUpperCase()}`}</Badge><h2 className="mt-3 text-2xl font-bold tracking-tight">Comparação histórica</h2><p className="mt-1 text-sm text-slate-500">{VARIABLE_META[filters.variable].label} · tolerância de {filters.toleranceMinutes} minutos</p></div>
      <ComparisonCharts rows={rows} variable={filters.variable} />
      <div className="my-5"><StatisticsCards stats={stats} unit={filters.variable === 'humidity' ? 'p.p.' : VARIABLE_META[filters.variable].unit} /></div>
      <ComparisonTable rows={rows} humidity={filters.variable === 'humidity'} />
      <div className="my-8 grid gap-5 xl:grid-cols-2"><StationMap own={selected} inmet={inmetQuery.data?.station} inmetObservation={inmetLatest} /><StationDetails own={selected} inmet={inmetQuery.data?.station} observation={inmetLatest} /></div>
    </>}
  </>
}

function ContractNotice() { return <Card className="mb-5 border-amber-200 bg-amber-50 p-4 shadow-none"><div className="flex gap-3"><Database className="mt-0.5 shrink-0 text-amber-600" size={19} /><div><p className="text-sm font-semibold text-amber-900">Integração INMET ainda não configurada</p><p className="mt-1 text-xs leading-relaxed text-amber-800">Defina <code className="rounded bg-white/70 px-1 py-0.5">VITE_INMET_API_URL</code>. O backend atual não expõe vínculo ou histórico INMET; comparações permanecem indisponíveis e nenhum dado é fabricado.</p></div></div></Card> }
function DashboardSkeleton() { return <><Skeleton className="mb-7 h-24" /><Skeleton className="mb-6 h-44" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[1, 2, 3, 4].map((i) => <Card key={i} className="p-5"><Skeleton className="h-28" /></Card>)}</div></> }
