import { describe, expect, it } from 'vitest'
import { combineInmetDateTime, formatStationDateTime } from './date'

describe('data e hora INMET', () => {
  it('combina DT_MEDICAO e HR_MEDICAO como UTC', () => {
    expect(combineInmetDateTime('2026-09-04', '2100')).toBe('2026-09-04T21:00:00.000Z')
  })
  it('converte UTC para America/Bahia na apresentação', () => {
    expect(formatStationDateTime('2026-09-04T21:00:00.000Z', 'dd/MM/yyyy HH:mm')).toBe('04/09/2026 18:00')
  })
  it('rejeita horário ausente', () => expect(combineInmetDateTime('2026-09-04', null)).toBeUndefined())
})
