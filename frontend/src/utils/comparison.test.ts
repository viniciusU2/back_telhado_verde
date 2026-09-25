import { describe, expect, it } from 'vitest'
import type { ObservacaoMeteorologica } from '../types/weather'
import { calculateComparisonStats, compareObservations } from './comparison'

const own: ObservacaoMeteorologica[] = [{ stationId: '1', stationName: 'Própria', source: 'PROPRIA', observedAtUtc: '2026-09-04T21:02:00.000Z', temperature: 29.1 }]
const inmet: ObservacaoMeteorologica[] = [{ stationId: 'A424', stationName: 'Irecê', source: 'INMET', observedAtUtc: '2026-09-04T21:00:00.000Z', temperature: 28.5 }]

describe('comparação temporal', () => {
  it('associa medições dentro de cinco minutos e calcula própria - INMET', () => {
    const rows = compareObservations(own, inmet, 'temperature', 5)
    expect(rows[0].status).toBe('correspondente')
    expect(rows[0].difference).toBeCloseTo(0.6)
    expect(calculateComparisonStats(rows).mae).toBeCloseTo(0.6)
  })
  it('não compara medições fora da tolerância', () => expect(compareObservations(own, inmet, 'temperature', 1)[0].status).toBe('sem-correspondencia'))
})
