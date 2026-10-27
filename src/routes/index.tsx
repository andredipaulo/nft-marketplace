import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useNfts } from '@/features/catalog/useNfts'
import { NftCard } from '@/components/NftCard'
import { LoginModal } from '@/components/LoginModal'
import { MobileNav } from '@/components/MobileNav'
import { useCollections } from '@/features/catalog/useCollections'
import { useNetworks } from '@/features/catalog/useNetworks'
import { HomePromos } from '@/components/HomePromos'
import { HomeBlog } from '@/components/HomeBlog'
import { HomeFooter } from '@/components/HomeFooter'
import {HomeHeader} from "@/components/HomeHeader.tsx";

export type CatalogSearch = {
  q?: string
  page?: number
  login?: boolean
}

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): CatalogSearch => {
    return {
      q: typeof search.q === 'string' ? search.q : undefined,
      page: typeof search.page === 'number' ? search.page : 1,
      login: search.login === true,
    }
  },
  component: HomePage,
})

function HomePage() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const { data, isLoading } = useNfts({ q: search.q, page: search.page })

  const [showLogin, setShowLogin] = useState(search.login || false)
  const [localSearch, setLocalSearch] = useState(search.q || '')

  const { data: collections, isLoading: isLoadingCollections } = useCollections()
  const { data: networks, isLoading: isLoadingNetworks } = useNetworks()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({ search: (prev) => ({ ...prev, q: localSearch || undefined, page: 1 }) })
  }

  const setPage = (page: number) => {
    navigate({ search: (prev) => ({ ...prev, page }) })
  }

  return (
    <div className="min-h-screen bg-ink text-fg pb-20 md:pb-0">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-4 md:py-8 flex flex-col gap-8 md:gap-16">

        <HomeHeader
          localSearch={localSearch}
          setLocalSearch={setLocalSearch}
          handleSearch={handleSearch}
          onOpenLogin={() => setShowLogin(true)}
          activeTab="inicio"
        />

        {/* HERO */}
        <section className="relative w-full rounded-[24px] overflow-hidden bg-[#140D0A] flex items-stretch mb-4 min-h-[220px] md:min-h-[450px]">
          <div className="flex flex-row w-full h-full">
            <div className="w-[60%] md:w-1/2 p-5 md:p-16 flex flex-col justify-center items-start z-10">
              <p className="font-mono text-[10px] md:text-sm text-[#F5F1EB] mb-1 md:mb-4 uppercase tracking-widest">
                Bem-vindo à Kurio
              </p>
              <h1 className="font-mono text-[20px] md:text-5xl font-bold leading-tight md:leading-[1.2] text-fg mb-2 md:mb-6 text-[#F5F1EB]">
                SEJA DONO DA<br />CULTURA DIGITAL
              </h1>
              <p className="font-mono text-[11px] md:text-base text-fg-secondary mb-3 md:mb-8 max-w-[180px] md:max-w-lg leading-relaxed text-[#CFB28C]">
                Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, apoie artistas e tenha uma parte da cultura da internet.
              </p>
              <button className="text-primary-accent md:bg-primary md:text-ink font-bold text-xs md:text-sm flex items-center gap-1 md:gap-0 md:px-8 md:py-3 rounded-md hover:text-primary md:hover:bg-primary-accent transition">
                EXPLORAR <span className="md:hidden">→</span>
              </button>
            </div>
            <div className="w-[40%] md:w-[450px] h-full md:h-[450px] relative md:ml-auto flex items-center justify-center p-2 md:p-4">
              <img src="/nfts/nft-1.png" alt="Destaque Kurio" className="w-full h-full object-cover object-center rounded-[24px] md:rounded-[24px] shadow-lg" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 pb-4 flex justify-center gap-2 z-20">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-2 h-2 rounded-full bg-fg-secondary/50"></div>
            <div className="w-2 h-2 rounded-full bg-fg-secondary/50"></div>
          </div>
        </section>

        {/* CATÁLOGO */}
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
          <aside className="hidden lg:block w-[310px] shrink-0">
            <div className="bg-surface-card p-5 rounded-md flex flex-col gap-10">
              <div className="flex flex-col gap-3">
                <h2 className="text-lg font-bold text-fg">Coleções</h2>
                <ul className="flex flex-col gap-2 px-3">
                  {isLoadingCollections ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <li key={i} className="flex justify-between animate-pulse">
                        <div className="h-4 bg-surface-dark w-1/2 rounded"></div>
                        <div className="h-4 bg-surface-dark w-1/4 rounded"></div>
                      </li>
                    ))
                  ) : (
                    collections?.map((col, index) => (
                      <li key={col.id} className={`flex justify-between text-[15px] cursor-pointer ${index === 0 ? 'text-primary-accent' : 'text-fg-secondary hover:text-fg'}`}>
                        <span>{col.name}</span>
                        <span>({col.count})</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="text-lg font-bold text-fg">Faixa de preço</h2>
                <div className="px-3">
                  <div className="h-1 w-full bg-primary/30 relative rounded-full mb-4">
                    <div className="absolute left-0 right-1/3 h-full bg-primary rounded-full"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary border-2 border-ink rounded-full"></div>
                    <div className="absolute right-1/3 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary border-2 border-ink rounded-full"></div>
                  </div>
                  <p className="text-fg text-[15px] mb-4">Preço: 0,02 - 12,30 ETH</p>
                  <button className="bg-primary text-ink font-bold px-4 py-2 rounded-md text-sm hover:bg-primary-accent">Aplicar</button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="text-lg font-bold text-fg">Redes</h2>
                <ul className="flex flex-col gap-2 px-3">
                  {isLoadingNetworks ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <li key={i} className="flex justify-between animate-pulse">
                        <div className="h-4 bg-surface-dark w-1/2 rounded"></div>
                        <div className="h-4 bg-surface-dark w-1/4 rounded"></div>
                      </li>
                    ))
                  ) : (
                    networks?.map((col, index) => (
                      <li key={col.id} className={`flex justify-between text-[15px] cursor-pointer ${index === 0 ? 'text-primary-accent' : 'text-fg-secondary hover:text-fg'}`}>
                        <span>{col.name}</span>
                        <span>({col.count})</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-b from-primary/10 to-primary/0 p-6 rounded-md flex flex-col gap-4 relative overflow-hidden">
              <div className="flex flex-col items-center text-center">
                <h2 className="text-primary-accent text-2xl font-bold mb-1">NFT EM DESTAQUE</h2>
                <p className="text-fg text-sm font-bold uppercase tracking-widest">OFERTA LIMITADA</p>
              </div>
              <img src="/nfts/nft-2.png" alt="NFT em destaque" className="w-full aspect-square object-cover rounded-[22px] shadow-lg" />
            </div>
          </aside>

          <main className="flex-1 flex flex-col gap-6">
            <div className="hidden md:flex items-center justify-between">
              <div className="flex gap-5 text-[15px]">
                <span className="text-primary-accent font-medium cursor-pointer border-primary-accent border-b-[4px]">Todos os NFTs</span>
                <span className="text-fg cursor-pointer hover:text-primary-accent">Novos lançamentos</span>
                <span className="text-fg cursor-pointer hover:text-primary-accent">Em alta</span>
              </div>
              <div className="text-[15px] flex items-center gap-2">
                <span className="text-fg-primary">Ordenar por:</span>
                <select className="bg-transparent text-fg outline-none cursor-pointer appearance-none">
                  <option value="recent">Listados recentemente ↓</option>
                  <option value="price_asc">Menor preço</option>
                  <option value="price_desc">Maior preço</option>
                </select>
              </div>
            </div>

            <div className="md:hidden flex gap-4 text-sm overflow-x-auto pb-2 border-b border-border">
              <span className="text-primary-accent font-bold border-b-2 border-primary pb-2 whitespace-nowrap">Todos os NFTs</span>
              <span className="text-fg pb-2 whitespace-nowrap">Novos lançamentos</span>
              <span className="text-fg pb-2 whitespace-nowrap">Em alta</span>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex flex-col gap-3">
                    <div className="bg-surface-card aspect-square rounded-lg"></div>
                    <div className="bg-surface-card h-4 w-2/3 rounded"></div>
                    <div className="bg-surface-card h-4 w-1/3 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
                {data?.items.map((nft) => (
                  <NftCard key={nft.id} nft={nft} />
                ))}
              </div>
            )}

            {!isLoading && data && (
              <div className="flex gap-2 justify-center md:justify-end mt-4">
                {Array.from({ length: Math.ceil(data.total / data.limit) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 flex items-center justify-center rounded text-lg font-bold ${search.page === i + 1 ? 'bg-primary text-ink' : 'border border-border text-fg hover:border-primary'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>

        <HomePromos />
        <HomeBlog />
        <HomeFooter />

      </div>

      {showLogin && (
        <LoginModal
          onClose={() => {
            setShowLogin(false)
            navigate({ search: (prev) => ({ ...prev, login: undefined }) })
          }}
        />
      )}
      <MobileNav />
    </div>
  )
}