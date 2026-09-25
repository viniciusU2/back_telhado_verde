import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { AlertCircle, Info } from 'lucide-react'

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-2xl border border-line bg-white shadow-card ${className}`} {...props} />
}

export function Button({ className = '', children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props}>
      {children}
    </button>
  )
}

export function Badge({ children, tone = 'green' }: { children: ReactNode; tone?: 'green' | 'blue' | 'gray' | 'amber' | 'red' }) {
  const colors = {
    green: 'bg-brand-50 text-brand-700 ring-brand-100', blue: 'bg-blue-50 text-blue-700 ring-blue-100',
    gray: 'bg-slate-100 text-slate-600 ring-slate-200', amber: 'bg-amber-50 text-amber-700 ring-amber-200',
    red: 'bg-red-50 text-red-700 ring-red-200',
  }
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide ring-1 ring-inset ${colors[tone]}`}>{children}</span>
}

export function Tooltip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex">
      <button type="button" aria-label={`Ajuda: ${text}`} className="rounded-full text-slate-400 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500">
        <Info size={15} />
      </button>
      <span role="tooltip" className="pointer-events-none absolute bottom-full right-0 z-30 mb-2 hidden w-56 rounded-xl bg-ink px-3 py-2 text-left text-xs font-normal leading-relaxed text-white shadow-xl group-hover:block group-focus-within:block">
        {text}
      </span>
    </span>
  )
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <Card className="flex min-h-56 flex-col items-center justify-center p-8 text-center"><div className="mb-4 rounded-2xl bg-slate-100 p-3 text-slate-500"><AlertCircle /></div><h3 className="font-semibold text-ink">{title}</h3><p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">{description}</p>{action && <div className="mt-5">{action}</div>}</Card>
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200 ${className}`} />
}
