import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createDevice, deleteDevice, listDevices, listReadings, updateDevice } from '../services/api'
import { fetchINMETData } from '../services/inmet'

export function useDevices() {
  return useQuery({ queryKey: ['devices'], queryFn: listDevices, staleTime: 5 * 60_000 })
}

export function useReadings() {
  return useQuery({
    queryKey: ['readings'], queryFn: () => listReadings(), refetchInterval: 15 * 60_000,
    placeholderData: keepPreviousData,
  })
}

export function useINMET() {
  return useQuery({
    queryKey: ['inmet'], queryFn: fetchINMETData, refetchInterval: 15 * 60_000,
    placeholderData: keepPreviousData,
  })
}

export function useDeviceMutations() {
  const client = useQueryClient()
  const invalidate = () => client.invalidateQueries({ queryKey: ['devices'] })
  return {
    create: useMutation({ mutationFn: createDevice, onSuccess: invalidate }),
    update: useMutation({ mutationFn: ({ id, data }: Parameters<typeof updateDevice>[0] extends never ? never : { id: number; data: Parameters<typeof updateDevice>[1] }) => updateDevice(id, data), onSuccess: invalidate }),
    remove: useMutation({ mutationFn: deleteDevice, onSuccess: invalidate }),
  }
}
