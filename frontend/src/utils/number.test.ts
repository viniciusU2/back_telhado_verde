import { describe, expect, it } from 'vitest'
import { metersPerSecondToKmPerHour, safeNumber } from './number'

describe('safeNumber', () => {
  it('converte strings numéricas e vírgula decimal', () => {
    expect(safeNumber('28.5')).toBe(28.5)
    expect(safeNumber('4,1')).toBe(4.1)
  })
  it.each([null, undefined, '', 'null', '-9999', 'abc'] as unknown[])('trata %s como ausente/inválido', (value) => {
    expect(safeNumber(value)).toBeUndefined()
  })
})

describe('metersPerSecondToKmPerHour', () => {
  it('converte m/s em km/h', () => expect(metersPerSecondToKmPerHour(4.1)).toBeCloseTo(14.76))
})
