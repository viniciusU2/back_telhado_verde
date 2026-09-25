import type { ApiDispositivo, ApiListaLeituras, DispositivoInput } from '../types/api'
import { requestJson } from './http'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')

export function listDevices(): Promise<ApiDispositivo[]> {
  return requestJson<ApiDispositivo[]>(`${API_URL}/dispositivo/?skip=0&limit=100`)
}

export function createDevice(data: DispositivoInput): Promise<{ status: string; id_dispositivo: number }> {
  return requestJson(`${API_URL}/dispositivo/`, { method: 'POST', body: JSON.stringify(data) })
}

export function updateDevice(id: number, data: DispositivoInput): Promise<ApiDispositivo> {
  return requestJson(`${API_URL}/dispositivo/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export function deleteDevice(id: number): Promise<{ status: string }> {
  return requestJson(`${API_URL}/dispositivo/${id}`, { method: 'DELETE' })
}

export function listReadings(params?: { type?: string; date?: string }): Promise<ApiListaLeituras> {
  const query = new URLSearchParams({ skip: '0', limit: '1000' })
  if (params?.type) query.set('tipo', params.type)
  if (params?.date) query.set('data', params.date)
  return requestJson<ApiListaLeituras>(`${API_URL}/leitura/?${query.toString()}`)
}
