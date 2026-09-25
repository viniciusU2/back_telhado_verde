import type { ComparisonStats } from '../types/weather'
import { formatValue } from '../utils/number'
import { Card, Tooltip } from './ui'

export function StatisticsCards({ stats, unit }: { stats: ComparisonStats; unit: string }) {
  const items = [
    ['Pares comparados', String(stats.pairs), 'Medições associadas dentro da tolerância temporal.'],
    ['Viés médio', `${formatValue(stats.bias, 2)} ${unit}`, 'Média de própria − INMET. Não representa certificação metrológica.'],
    ['MAE', `${formatValue(stats.mae, 2)} ${unit}`, 'Média dos erros absolutos; ignora o sinal.'],
    ['RMSE', `${formatValue(stats.rmse, 2)} ${unit}`, 'Raiz do erro quadrático médio; dá mais peso a desvios maiores.'],
    ['Maior diferença', `${formatValue(stats.maxDifference, 2)} ${unit}`, 'Maior diferença absoluta encontrada no período.'],
    ['Disponibilidade', `${formatValue(stats.availabilityPercent, 0)}%`, 'Percentual de leituras próprias com par INMET válido.'],
    ['Atraso médio', `${formatValue(stats.averageDelayMinutes, 1)} min`, 'Diferença média de horário entre os pares associados.'],
  ]
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">{items.map(([label, value, help]) => <Card key={label} className="p-4"><div className="flex justify-between gap-2"><p className="text-xs font-semibold text-slate-500">{label}</p><Tooltip text={help} /></div><p className="mt-2 text-lg font-bold">{value}</p></Card>)}</div>
}
