import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import { ArrowLeft, Heart, Minus, Plus, Star, ShoppingCart, Search, Link as LinkIcon } from 'lucide-react'
import type { NFT } from '@/lib/api/types'
import { useCartStore } from '@/features/cart/useCartStore'
import { MoreFromCollection } from '@/components/MoreFromCollection'
import {HomeFooter} from "@/components/HomeFooter.tsx";
import {HomeHeader} from "@/components/HomeHeader.tsx";


export const Route = createFileRoute('/nft/$id')({
  component: NftDetailPage,
})

function NftDetailPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const addItem = useCartStore((state) => state.addItem)
  const [quantity, setQuantity] = useState(1)
  const [localSearch, setLocalSearch] = useState('')

  // Função de busca (vai redirecionar para a home)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({ to: '/', search: { q: localSearch || undefined, page: 1 } })
  }


  const { data: nft, isLoading, isError } = useQuery({
    queryKey: ['nft', id],
    queryFn: async () => {
      const { data } = await api.get<NFT>(`/nfts/${id}`)
      return data
    },
    retry: false,
  })

  if (isLoading) return <div className="p-12 text-fg text-center">Carregando NFT...</div>
  if (isError || !nft) {
    return (
      <div className="p-12 text-center flex flex-col items-center gap-4">
        <h1 className="text-2xl text-fg">NFT não encontrado</h1>
        <Link to="/" className="text-primary-accent underline">Voltar para a Home</Link>
      </div>
    )
  }

  const handleBuy = () => {
    addItem(nft, quantity)
    navigate({ to: '/cart' })
  }

  return (
    <div className="min-h-screen bg-ink text-fg pb-32 md:pb-12">
      <div className="max-w-[1200px] mx-auto md:px-6 md:py-8 flex flex-col gap-8 relative">

        <div className="hidden lg:block px-4 md:px-0 mt-8 md:mt-16 w-full">
        <HomeHeader
          localSearch={localSearch}
          setLocalSearch={setLocalSearch}
          handleSearch={handleSearch}
          onOpenLogin={() => {}}
          activeTab="mercado"
        />
        </div>

        {/* BOTÕES FLUTUANTES MOBILE (Voltar e Favoritar) */}
        <div className="absolute top-4 left-4 right-4 flex justify-between z-20 md:hidden">
          <button onClick={() => navigate({ to: '/' })} className="w-10 h-10 bg-ink/60 backdrop-blur rounded-full flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-fg" />
          </button>
          <button className="w-10 h-10 bg-ink/60 backdrop-blur rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary-accent" />
          </button>
        </div>

        {/* CONTAINER DE DUAS COLUNAS (Imagem e Info) */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 px-4 md:px-0 pt-16 md:pt-0">

          {/* COLUNA ESQUERDA: GALERIA */}
          <div className="w-full md:w-1/2 flex flex-col-reverse md:flex-row gap-4 min-w-0">
            {/* Miniaturas */}
            <div className="hidden md:flex flex-col gap-4 overflow-y-auto shrink-0">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-lg bg-[#241612] p-1 cursor-pointer border border-transparent hover:border-primary transition">
                  <img src={nft.image} alt={`Miniatura ${i}`} className="w-full h-full object-cover rounded" />
                </div>
              ))}
            </div>

            {/* Imagem Principal */}
            <div className="flex-1 min-w-0 relative flex items-center justify-center bg-[#241612] rounded-2xl p-2 md:p-3 max-h-[490px] md:h-[4900px]">

              <div className="relative w-full h-full">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-full object-cover rounded-[24px] md:rounded-xl"
                />
                <button className="hidden md:flex absolute top-1 right-1 w-10 h-10 bg-[#38220F] rounded-full flex items-center justify-center border border-border">
                  <Search className="w-5 h-5 text-fg-secondary" />
                </button>
              </div>

            </div>
          </div>

          {/* INFORMAÇÕES (Bottom Sheet no mobile, direita no desktop) */}
          <div className="w-full md:w-1/2 flex flex-col gap-2 bg-ink relative z-10 -mt-8 md:mt-0 rounded-t-3xl md:rounded-none md:gap-4 pt-0 px-6 md:p-0 shadow-[0_-10px_40px_rgba(20,13,10,0.8)] md:shadow-none">

            {/* Título e Avaliação */}
            <div className="flex justify-between items-start md:block">
              <h1 className="text-2lg md:text-4xl font-bold md:mb-3 pr-4">{nft.name}</h1>

              <div className="md:hidden flex items-center gap-1 border border-primary text-primary-accent px-2 py-1 rounded-full text-sm shrink-0">
                <Star className="w-3 h-3 fill-primary" /> 4.8 <span className="text-fg-secondary">(19)</span>
              </div>

              {/* Preço e Estrelas (Desktop) */}
              <div className="hidden md:flex md:items-center justify-between border-b border-border pb-3 gap-0">
                <span className="text-2xl font-bold text-primary-accent">{nft.price} ETH</span>
                <div className="flex items-center gap-1 text-sm text-fg-secondary">
                  <div className="flex text-primary-accent">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="text-fg ml-1">19 avaliações de colecionadores</span>
                </div>
              </div>

            </div>

            <div className="mt-0">
              <h3 className="hidden md:block font-bold mb-0 text-base md:text-sm md:mb-0">Sobre este NFT:</h3>
            </div>

            <p className="text-[14px] leading-[24px] font-normal text-fg-secondary md:mt-0 md:mb-0">
              Um colecionável digital 1/50 finalizado à mão da coleção Kurio Editions, verificado na {nft.network}.
            </p>

            {/* Edição */}
            <div className="mt-0">
              <h3 className="font-bold mb-0 text-base md:text-lg md:mb-3">Edição:</h3>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="px-3 py-1 border border-border rounded-full text-fg-secondary">1/10</span>
                <span className="px-3 py-1 border border-border rounded-full text-fg-secondary">1/10</span>
                <span className="px-3 py-1 border border-primary text-primary rounded-full font-bold">1/50</span>
                <span className="px-3 py-1 border border-border rounded-full text-fg-secondary">ABERTA</span>
              </div>
            </div>

            {/* Detalhes */}
            <div className="flex flex-col gap-3 text-sm md:text-base text-fg-secondary border-b border-border/50 pb-6">
              <p>ID do token: #{nft.id}</p>
              <p>Coleção: {nft.collection}</p>
              <p>Atributos: Óculos, Esmeralda, Raro</p>
            </div>

            {/* Compartilhar (Desktop) */}
            <div className="hidden md:flex items-center gap-3 mt-2">
              <span className="font-bold text-fg">Compartilhar este NFT:</span>
              <a href="#" className="text-primary-accent hover:text-primary transition" aria-label="Compartilhar no LinkedIn"><LinkIcon className="w-4 h-4" /></a>
              <a href="#" className="text-primary-accent hover:text-primary transition" aria-label="Copiar link"><LinkIcon className="w-4 h-4" /></a>
              <a href="#" className="text-primary-accent hover:text-primary transition" aria-label="Compartilhar no Twitter"><LinkIcon className="w-4 h-4" /></a>
            </div>

            {/* Preço, Quantidade e Comprar (Desktop) */}
            <div className="hidden md:flex items-center justify-between mt-4 w-full">
              <div className="flex items-center gap-2">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 bg-[#D28A4C] text-ink rounded-lg flex items-center justify-center hover:bg-primary transition">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-lg w-6 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 bg-[#D28A4C] text-ink rounded-lg flex items-center justify-center hover:bg-primary transition">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleBuy} className="bg-[#D28A4C] text-ink font-bold px-8 py-2.5 rounded-lg hover:bg-primary transition h-10 text-sm">
                  COMPRAR
                </button>
                <button className="flex items-center justify-center gap-2 px-6 h-10 border border-[#D28A4C] text-[#D28A4C] rounded-lg hover:bg-[#D28A4C]/10 transition text-sm">
                  <Heart className="w-4 h-4" /> Favoritar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TABS E DETALHES DESCRITIVOS */}
        <div className="hidden lg:block px-4 md:px-0 mt-8 md:mt-16 w-full">
          <div className="flex gap-8 border-b border-border mb-6">
            <button className="pb-3 border-b-2 border-primary text-primary-accent font-bold text-lg">
              Detalhes do NFT
            </button>
            <button className="pb-3 text-fg-secondary hover:text-fg text-lg transition">
              Avaliações de colecionadores (19)
            </button>
          </div>

          <div className="text-sm md:text-base text-fg-secondary leading-relaxed max-w-5xl flex flex-col gap-6">
            <p>
              <strong className="text-fg">{nft.name}</strong> é uma obra digital 1/50 finalizada à mão da coleção Kurio Editions.
              Cada atributo fica armazenado nos metadados do token e verificado na {nft.network}. A obra explora identidade,
              movimento e luz em um mundo digital sem fronteiras.
            </p>

            <p>
              A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores e um registro permanente
              de procedência registrada na rede. Nova Sato recebe 5% de direitos autorais nas vendas secundárias, apoiando novos
              trabalhos e lançamentos da comunidade.
            </p>

            <div>
              <p className="text-fg font-bold mb-1">Rede:</p>
              <p>Cunhado na {nft.network} com procedência imutável e metadados armazenados no IPFS.</p>
            </div>

            <div>
              <p className="text-fg font-bold mb-1">Contrato:</p>
              <p>Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis.</p>
            </div>

            <div>
              <p className="text-fg font-bold mb-1">Direitos autorais:</p>
              <p>0x7A42...19E8 • Contrato inteligente ERC-721 verificado.</p>
            </div>
          </div>
        </div>

        {/* MAIS DESTA COLEÇÃO */}
        <div className="hidden lg:block px-4 md:px-0 mt-8 md:mt-16 w-full">
          <MoreFromCollection title="Mais desta coleção" />
        </div>

        <div className="hidden lg:block px-4 md:px-0 mt-8 md:mt-16 w-full">
          <HomeFooter/>
        </div>
      </div>

      {/* BARRA FIXA DE COMPRA (Apenas Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#140D0A] px-6 pb-8 flex flex-col gap-5 z-50 rounded-t-[40px] shadow-[0_-10px_30px_rgba(20,13,10,0.95)]">

        {/* Linha 1: Quantidade e Preço */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[#CFB28C] text-lg font-medium mr-1">Qtd.</span>

            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-10 bg-[#D28A4C] rounded-full flex items-center justify-center text-[#140D0A] hover:bg-[#E89B55] transition">
              <Minus className="w-4 h-4" strokeWidth={3} />
            </button>

            <span className="font-bold text-xl w-6 text-center">{quantity}</span>

            <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-10 bg-[#D28A4C] rounded-full flex items-center justify-center text-[#140D0A] hover:bg-[#E89B55] transition">
              <Plus className="w-4 h-4" strokeWidth={3} />
            </button>
          </div>

          <span className="font-bold text-[#D28A4C] text-2xl tracking-wide">
            {(parseFloat(nft.price) * quantity).toFixed(2)} ETH
          </span>
        </div>

        {/* Linha 2: Botão de Comprar e Carrinho */}
        <div className="flex items-center gap-4">
          <button onClick={handleBuy} className="flex-1 bg-[#D28A4C] text-[#140D0A] font-bold py-4 rounded-full text-lg hover:bg-[#E89B55] transition">
            Comprar NFT
          </button>

          {/* Botão Carrinho (Sem borda, fundo sutil) */}
          <button onClick={() => navigate({ to: '/cart' })} className="w-[60px] h-[60px] bg-[#1A0F0C] rounded-full flex items-center justify-center shrink-0">
            <ShoppingCart className="w-6 h-6 text-[#CFB28C]" />
          </button>
        </div>
      </div>

    </div>
  )
}