import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import type { NftsResponse } from '@/lib/api/types'

export function useNfts(params: { q?: string; page?: number }) {
  return useQuery({
    queryKey: ['nfts', params],
    queryFn: async () => {
      // Aqui o axios transforma { q: 'abc', page: 1 } na URL ?q=abc&page=1
      const { data } = await api.get<NftsResponse>('/nfts', {
        params: {
          q: params.q,
          page: params.page
        }
      })
      return data
    },
  })
}