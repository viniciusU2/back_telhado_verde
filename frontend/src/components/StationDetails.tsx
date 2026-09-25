import { ExternalLink, MapPinned } from 'lucide-react'
import type { ApiDispositivo } from '../types/api'
import type { EstacaoINMET, ObservacaoMeteorologica } from '../types/weather'
import { formatValue, safeNumber } from '../utils/number'
import { Badge, Button, Card } from './ui'

export function StationDetails({ own: _own, inmet, observation: _observation }: { own?: ApiDispositivo; inmet?: EstacaoINMET; observation?: ObservacaoMeteorologica }) {
  const details = [
    ['Município', inmet?.NOME], ['UF', inmet?.UF], ['Região', inmet?.REGIAO], ['Código IBGE', inmet?.GEOCODE],
    ['Latitude', formatOptional(safeNumber(inmet?.LATITUDE), 6)], ['Longitude', formatOptional(safeNumber(inmet?.LONGITUDE), 6)],
    ['Distância pesquisada', formatOptional(safeNumber(inmet?.DISTANCIA_EM_KM), 1, ' km')],
  ]
  const mapUrl = inmet ? `https://www.openstreetmap.org/?mlat=${inmet.LATITUDE}&mlon=${inmet.LONGITUDE}#map=12/${inmet.LATITUDE}/${inmet.LONGITUDE}` : undefined

  return <Card className="overflow-hidden">
    <div className="flex flex-col gap-4 border-b border-line bg-slate-50/60 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-skybrand"><MapPinned size={21} /></span><div className="min-w-0"><div className="flex items-center gap-2"><h3 className="truncate font-bold">{inmet?.NOME || 'Estação INMET'}</h3><Badge tone="blue">INMET</Badge></div><p className="mt-1 text-xs text-slate-400">Estação oficial de referência · código {inmet?.CODIGO || 'indisponível'}</p></div></div>
      {mapUrl && <a href={mapUrl} target="_blank" rel="noreferrer"><Button className="w-full bg-white text-slate-600 ring-1 ring-inset ring-line hover:bg-slate-50 sm:w-auto"><ExternalLink size={15} />Abrir no mapa</Button></a>}
    </div>
    <dl className="grid grid-cols-2 gap-x-6 gap-y-5 p-5 sm:grid-cols-3">{details.map(([label, value]) => <div key={label} className={label === 'Distância pesquisada' ? 'col-span-2 sm:col-span-1' : ''}><dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 text-sm font-semibold text-ink">{value || 'Dado indisponível'}</dd></div>)}</dl>
  </Card>
}

function formatOptional(value?: number, digits = 1, suffix = '') { return value === undefined ? 'Dado indisponível' : `${formatValue(value, digits)}${suffix}` }
