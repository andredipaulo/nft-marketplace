import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/client'

export interface Collection {
  id: string
  name: string
  count: number
}

export function useCollections() {
  return useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      const { data } = await api.get<Collection[]>('/collections')
      return data
    },
  })
}