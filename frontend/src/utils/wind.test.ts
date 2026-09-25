import { describe, expect, it } from 'vitest'
import { degreesToCardinal } from './wind'

describe('degreesToCardinal', () => {
  it('converte 93 graus em Leste', () => expect(degreesToCardinal(93)).toEqual({ short: 'L', label: 'Leste' }))
  it('trata o limite 360 como Norte', () => expect(degreesToCardinal(360)?.short).toBe('N'))
  it('rejeita graus fora do domínio', () => expect(degreesToCardinal(361)).toBeUndefined())
})
