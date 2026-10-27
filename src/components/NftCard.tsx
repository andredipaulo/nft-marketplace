import { Link } from '@tanstack/react-router'
import { Heart, ShoppingCart, Search } from 'lucide-react'
import type { NFT } from '@/lib/api/types'

export function NftCard({ nft }: { nft: NFT }) {
  return (
    <article className="group flex flex-col gap-3 w-full">
      <Link to="/nft/$id" params={{ id: nft.id }} className="relative block aspect-square overflow-hidden rounded-card bg-surface-card p-1">
        <img
          src={nft.image}
          alt={nft.name}
          loading="lazy"
          className="h-full w-full rounded-card-img object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Overlay de Hover com Ícones */}
        <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center gap-1 pt-4">
          <button className="bg-surface-card p-3 hover:bg-primary hover:text-ink transition" title="Adicionar ao carrinho">
            <ShoppingCart className="w-5 h-5" />
          </button>
          <button className="bg-surface-card p-3 hover:bg-primary hover:text-ink transition" title="Favoritar">
            <Heart className="w-5 h-5" />
          </button>
          <button className="bg-surface-card p-3 hover:bg-primary hover:text-ink transition" title="Ver detalhes">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </Link>

      <div className="flex flex-col gap-1">
        <h3 className="font-mono text-base text-fg truncate">{nft.name}</h3>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-lg font-bold text-primary-accent">
            {nft.price} ETH
          </span>
          {nft.compareAtPrice && (
            <span className="font-mono text-sm text-fg-tertiary line-through">
              {nft.compareAtPrice} ETH
            </span>
          )}
        </div>
      </div>
    </article>
  )
}