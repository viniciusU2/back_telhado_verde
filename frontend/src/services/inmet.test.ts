import { describe, expect, it } from 'vitest'
import { mockInmetResponse } from '../mocks/inmet-response'
import { normalizeINMETResponse } from './inmet'

describe('normalização INMET', () => {
  it('mapeia o contrato bruto para o modelo normalizado', () => {
    const result = normalizeINMETResponse(mockInmetResponse)
    expect(result.station.CODIGO).toBe('A424')
    expect(result.observations).toHaveLength(1)
    expect(result.observations[0]).toMatchObject({ stationId: 'A424', source: 'INMET', temperature: 28.5, humidity: 46, windDirection: 93 })
  })
  it('trata marcadores ausentes sem inventar valor', () => {
    const raw = structuredClone(mockInmetResponse)
    if (!Array.isArray(raw.dados)) { raw.dados.TEM_INS = '-9999'; raw.dados.UMD_INS = 'null' }
    const observation = normalizeINMETResponse(raw).observations[0]
    expect(observation.temperature).toBeUndefined()
    expect(observation.humidity).toBeUndefined()
  })
  it('rejeita contrato sem estação', () => expect(() => normalizeINMETResponse({ dados: {} })).toThrow(/estacao/))
})
