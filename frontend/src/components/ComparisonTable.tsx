import { ChevronLeft, ChevronRight, Download, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { ComparisonRow } from '../types/weather'
import { formatStationDateTime } from '../utils/date'
import { formatValue } from '../utils/number'
import { Badge, Button, Card } from './ui'

export function ComparisonTable({ rows, humidity = false }: { rows: ComparisonRow[]; humidity?: boolean }) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [descending, setDescending] = useState(true)
  const pageSize = 8
  const filtered = useMemo(() => rows.filter((row) => `${formatStationDateTime(row.ownAt)} ${row.status}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => (descending ? b.ownAt.localeCompare(a.ownAt) : a.ownAt.localeCompare(b.ownAt))), [rows, query, descending])
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)

  function exportCsv() {
    const csv = [['Data própria', 'Data INMET', 'Própria', 'INMET', 'Diferença', 'Unidade', 'Situação'], ...filtered.map((row) => [row.ownAt, row.inmetAt || '', row.ownValue ?? '', row.inmetValue ?? '', row.difference ?? '', row.unit, row.status])].map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(';')).join('\n')
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a'); link.href = url; link.download = 'comparacao-meteorologica.csv'; link.click(); URL.revokeObjectURL(url)
  }

  return <Card className="overflow-hidden"><div className="flex flex-col justify-between gap-3 border-b border-line p-5 sm:flex-row sm:items-center"><div><h3 className="font-semibold">Medições comparadas</h3><p className="mt-1 text-xs text-slate-400">Somente pares dentro da tolerância configurada são comparados.</p></div><div className="flex gap-2"><label className="flex h-10 items-center gap-2 rounded-xl border border-line px-3 text-slate-400 focus-within:border-brand-500"><Search size={15} /><input aria-label="Filtrar tabela" className="w-36 bg-transparent text-sm text-ink outline-none" placeholder="Filtrar" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1) }} /></label><Button onClick={exportCsv} disabled={!rows.length} className="border border-line bg-white text-slate-600"><Download size={15} />CSV</Button></div></div><div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400"><tr><th className="cursor-pointer px-5 py-3" onClick={() => setDescending(!descending)}>Data e hora ↕</th><th className="px-5 py-3 text-right">Própria</th><th className="px-5 py-3 text-right">INMET</th><th className="px-5 py-3 text-right">Diferença</th><th className="px-5 py-3">Unidade</th><th className="px-5 py-3">Situação</th></tr></thead><tbody className="divide-y divide-line">{visible.map((row) => <tr key={row.id} className="hover:bg-slate-50/70"><td className="px-5 py-4"><p className="font-medium">{formatStationDateTime(row.ownAt, 'dd/MM/yyyy HH:mm')}</p>{row.inmetAt && <p className="mt-0.5 text-xs text-slate-400">INMET {formatStationDateTime(row.inmetAt, 'HH:mm')}</p>}</td><td className="px-5 py-4 text-right font-semibold">{formatValue(row.ownValue, 2)}</td><td className="px-5 py-4 text-right font-semibold">{formatValue(row.inmetValue, 2)}</td><td className="px-5 py-4 text-right font-semibold">{row.difference === undefined ? '—' : `${row.difference > 0 ? '+' : ''}${formatValue(row.difference, 2)}`}</td><td className="px-5 py-4 text-slate-500">{humidity ? 'p.p.' : row.unit}</td><td className="px-5 py-4"><Status status={row.status} /></td></tr>)}{!visible.length && <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400">Nenhuma medição para exibir.</td></tr>}</tbody></table></div><div className="flex items-center justify-between border-t border-line px-5 py-4 text-xs text-slate-500"><span>{filtered.length} registros</span><div className="flex items-center gap-2"><button aria-label="Página anterior" disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-line p-1.5 disabled:opacity-30"><ChevronLeft size={16} /></button><span>{page} / {totalPages}</span><button aria-label="Próxima página" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-line p-1.5 disabled:opacity-30"><ChevronRight size={16} /></button></div></div></Card>
}

function Status({ status }: { status: ComparisonRow['status'] }) { if (status === 'correspondente') return <Badge>Correspondente</Badge>; if (status === 'dado-ausente') return <Badge tone="gray">Dado ausente</Badge>; return <Badge tone="amber">Horário sem par</Badge> }
