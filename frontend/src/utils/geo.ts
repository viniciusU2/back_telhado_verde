export function haversineDistanceKm(lat1?: number, lon1?: number, lat2?: number, lon2?: number): number | undefined {
  if ([lat1, lon1, lat2, lon2].some((value) => value === undefined)) return undefined
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180
  const earthRadiusKm = 6371
  const dLat = toRadians(lat2! - lat1!)
  const dLon = toRadians(lon2! - lon1!)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1!)) * Math.cos(toRadians(lat2!)) * Math.sin(dLon / 2) ** 2
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function coordinatesAreValid(latitude?: number, longitude?: number): boolean {
  return latitude !== undefined && longitude !== undefined && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180
}
