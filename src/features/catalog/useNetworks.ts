import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/client'

export interface Networks {
  id: string
  name: string
  count: number
}

export function useNetworks() {
  return useQuery({
    queryKey: ['networks'],
    queryFn: async () => {
      const { data } = await api.get<Networks[]>('/networks')
      return data
    },
  })
}