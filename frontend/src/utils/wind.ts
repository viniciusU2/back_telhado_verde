const DIRECTIONS = [
  { short: 'N', label: 'Norte' },
  { short: 'NE', label: 'Nordeste' },
  { short: 'L', label: 'Leste' },
  { short: 'SE', label: 'Sudeste' },
  { short: 'S', label: 'Sul' },
  { short: 'SO', label: 'Sudoeste' },
  { short: 'O', label: 'Oeste' },
  { short: 'NO', label: 'Noroeste' },
] as const

export function degreesToCardinal(degrees?: number): { short: string; label: string } | undefined {
  if (degrees === undefined || !Number.isFinite(degrees) || degrees < 0 || degrees > 360) return undefined
  return DIRECTIONS[Math.round((degrees % 360) / 45) % 8]
}
