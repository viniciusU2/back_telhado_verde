import { Clock3, RefreshCw } from 'lucide-react'
import { useMemo } from 'react'
import { useReadings } from '../hooks/useWeatherData'
import type { ApiDispositivo } from '../types/api'
import type { ObservacaoMeteorologica } from '../types/weather'
import { mapEstacaoPropriaToObservacao } from '../utils/adapters'
import { formatStationDateTime, formatUtcDateTime } from '../utils/date'
import { Button } from './ui'

export function DashboardHeader({ device, observation: _observation, refreshing, onRefresh }: { device?: ApiDispositivo; observation?: ObservacaoMeteorologica; refreshing: boolean; onRefresh: () => void }) {
  const readings = useReadings()
  const ownLatest = useMemo(
    () => device ? mapEstacaoPropriaToObservacao(device, readings.data?.dados || []).at(-1) : undefined,
    [device, readings.data],
  )

  return (
    <section className="mb-7 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Condições meteorológicas</h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
          <span className="font-semibold text-slate-700">{device?.nome || 'Selecione uma estação'}</span>
          {device && <span>Código própria #{device.id}</span>}
          <span className="inline-flex items-center gap-1.5"><Clock3 size={15} /><span>Último dado da estação própria: <strong className="font-semibold text-slate-700">{formatStationDateTime(ownLatest?.observedAtUtc)}</strong> <span className="text-slate-400">({formatUtcDateTime(ownLatest?.observedAtUtc)})</span></span></span>
        </div>
      </div>
      <Button onClick={onRefresh} disabled={refreshing} className="border border-line bg-white text-slate-700 shadow-sm hover:bg-slate-50"><RefreshCw size={17} className={refreshing ? 'animate-spin' : ''} />Atualizar dados</Button>
    </section>
  )
}
