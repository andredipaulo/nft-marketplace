import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import type { NftsResponse } from '@/lib/api/types'

export function MoreFromCollection({title} : { title : string}) {

  // Puxa mais 5 NFTs da API (usando page 2, por exemplo, para não repetir os da home)
  const { data } = useQuery({
    queryKey: ['nfts', { page: 2 }],
    queryFn: async () => {
      const { data } = await api.get<NftsResponse>('/nfts', { params: { page: 2, limit: 5 } })
      return data
    },
  })

  if (!data?.items) return null

  return (
    <div className="w-full mt-16">
      {/* Título */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-bold text-primary-accent whitespace-nowrap">{title}</h2>
        <div className="h-px w-full bg-border"></div>
      </div>

      {/* Carrossel Horizontal */}
      <div className="flex overflow-x-auto gap-4 md:gap-6 pb-4 snap-x snap-mandatory scrollbar-hide">
        {data.items.map((nft) => (
          <Link
            key={nft.id}
            to="/nft/$id"
            params={{ id: nft.id }}
            className="snap-start shrink-0 w-[200px] md:w-[240px] group"
          >
            <div className="bg-surface-card p-2 rounded-xl">
              <div className="aspect-square overflow-hidden rounded-lg bg-surface-dark">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-1">
              <span className="text-sm text-fg truncate">{nft.name}</span>
              <span className="text-base font-bold text-primary-accent">{nft.price} ETH</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Bolinhas do Carrossel (Visual) */}
      <div className="flex justify-center gap-2 mt-4">
        <div className="w-2.5 h-2.5 rounded-full border border-primary bg-ink"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
        <div className="w-2.5 h-2.5 rounded-full border border-primary bg-ink"></div>
      </div>
    </div>
  )
}