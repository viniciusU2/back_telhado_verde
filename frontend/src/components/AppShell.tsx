import { BarChart3, Menu, RadioTower, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { BrandIcon } from './BrandIcon'

export type PageId = 'dashboard' | 'stations'

export function AppShell({ page, onNavigate, children }: { page: PageId; onNavigate: (page: PageId) => void; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const items = [
    { id: 'dashboard' as const, label: 'Monitoramento', icon: BarChart3 },
    { id: 'stations' as const, label: 'Estações', icon: RadioTower },
  ]
  return (
    <div className="min-h-screen bg-mist text-ink">
      <header className="sticky top-0 z-40 border-b border-line/80 bg-white/90 backdrop-blur lg:hidden">
        <div className="flex h-16 items-center justify-between px-4"><Brand compact /><button aria-label="Abrir menu" onClick={() => setOpen(true)} className="rounded-lg p-2"><Menu /></button></div>
      </header>
      {open && <button aria-label="Fechar menu" className="fixed inset-0 z-40 bg-ink/30 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-hidden border-r border-line bg-white p-5 transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex shrink-0 items-center justify-between"><Brand /><button aria-label="Fechar menu" onClick={() => setOpen(false)} className="rounded-lg p-2 lg:hidden"><X size={20} /></button></div>
        <nav aria-label="Navegação principal" className="mt-8 shrink-0 space-y-2">{items.map((item) => <button key={item.id} onClick={() => { onNavigate(item.id); setOpen(false) }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${page === item.id ? 'bg-brand-50 text-brand-700' : 'text-slate-500 hover:bg-slate-50 hover:text-ink'}`}><item.icon size={19} />{item.label}</button>)}</nav>
        <div id="sidebar-filters" className="mt-5 min-h-0 flex-1 overflow-y-auto border-t border-line pt-5 pr-1 empty:hidden" />
      </aside>
      <main className="lg:pl-72"><div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div></main>
    </div>
  )
}

function Brand({ compact = false }: { compact?: boolean }) {
  return <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white"><BrandIcon className="h-7 w-7" /></div>{!compact && <div><p className="font-bold tracking-tight">Telhado Verde</p><p className="text-[11px] font-medium uppercase tracking-[.15em] text-slate-400">Observatório</p></div>}</div>
}
