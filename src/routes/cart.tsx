import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Trash2, Minus, Plus, ArrowLeft } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import { useCartStore } from '@/features/cart/useCartStore'
import { MoreFromCollection } from '@/components/MoreFromCollection'
import { HomeHeader } from '@/components/HomeHeader'
import { HomeFooter } from '@/components/HomeFooter'

export const Route = createFileRoute('/cart')({
  component: CartPage,
})

function CartPage() {
  const navigate = useNavigate()
  const {
    items, updateQuantity, removeItem,
    discountPercentage, couponCode, applyCoupon, removeCoupon
  } = useCartStore()

  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')
  const [localSearch, setLocalSearch] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({ to: '/', search: { q: localSearch || undefined, page: 1 } })
  }

  const subtotal = items.reduce((acc, item) => acc + (parseFloat(item.nft.price) * item.quantity), 0)
  const discountAmount = subtotal * (discountPercentage / 100)
  const networkFee = items.length > 0 ? 0.016 : 0
  const total = subtotal - discountAmount + networkFee

  const validateCoupon = useMutation({
    mutationFn: async (code: string) => {
      const { data } = await api.post('/cart/validate-coupon', { code })
      return data
    },
    onSuccess: (data, variables) => {
      applyCoupon(variables, data.discountPercentage)
      setCouponError('')
    },
    onError: (error: any) => {
      setCouponError(error.response?.data?.message || 'Erro ao validar cupom')
    }
  })

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponInput.trim()) return
    validateCoupon.mutate(couponInput)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ink text-fg flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl font-bold">Seu carrinho está vazio</h1>
        <Link to="/" className="bg-primary text-ink px-6 py-2 rounded-lg font-bold hover:bg-primary-accent transition">
          Explorar NFTs
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ink text-fg pb-6 md:pb-12">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-0 md:gap-8 md:px-6 md:py-8 relative">

        {/* HEADER MOBILE */}
        <div className="md:hidden flex items-center p-4 border-b border-border/50 mb-2">
          <button onClick={() => navigate({ to: '/' })} className="w-10 h-10 bg-surface-card rounded-full flex items-center justify-center mr-4">
            <ArrowLeft className="w-5 h-5 text-fg" />
          </button>
          <h1 className="text-xl font-bold text-fg">Carrinho de NFTs</h1>
        </div>

        {/* HEADER DESKTOP */}
        <div className="hidden md:block">
          <HomeHeader
            localSearch={localSearch}
            setLocalSearch={setLocalSearch}
            handleSearch={handleSearch}
            onOpenLogin={() => {}}
            activeTab="mercado"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-0 md:gap-12">

          {/* LISTA DE ITENS */}
          <div className="flex-1 min-w-0 px-4 md:px-0">
            {/* Cabeçalho da Tabela (Só Desktop) */}
            <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr_auto] gap-4 text-fg-secondary text-sm border-b border-border pb-2 mb-4">
              <span>NFTs</span>
              <span>Preço</span>
              <span className="text-center">Edições</span>
              <span className="text-right">Total</span>
              <span className="w-6"></span>
            </div>

            {/* Itens */}
            <div className="flex flex-col gap-4">
              {items.map((item) => {
                const itemTotal = parseFloat(item.nft.price) * item.quantity
                return (
                  <div key={item.nft.id} className="bg-surface-card md:bg-transparent p-3 md:p-0 rounded-xl md:rounded-none border border-border md:border-none md:border-b md:border-border/50 flex md:grid md:grid-cols-[3fr_1fr_1fr_1fr_auto] gap-4 items-center md:pb-4">

                    {/* Info NFT */}
                    <div className="flex gap-4 items-center flex-1">
                      <img src={item.nft.image} alt={item.nft.name} className="w-20 h-20 md:w-16 md:h-16 object-cover rounded-lg md:rounded" />
                      <div className="flex flex-col gap-1 md:gap-0">
                        <h3 className="font-bold text-base md:text-sm">{item.nft.name}</h3>
                        <p className="text-xs text-fg-secondary">Edição: 1/50</p>
                        <span className="md:hidden text-primary-accent font-bold mt-1">{item.nft.price} ETH</span>
                      </div>
                    </div>

                    {/* Preço Unitário (Só Desktop) */}
                    <span className="hidden md:block text-sm">{item.nft.price} ETH</span>

                    {/* Controles de Quantidade */}
                    <div className="flex items-center justify-center gap-3 md:gap-2 md:border md:border-border md:rounded-full md:px-2 md:py-1 md:bg-surface-card w-fit mx-auto md:mx-auto">
                      <button onClick={
                        () => {
                          if (item.quantity <= 1) {
                            removeItem(item.nft.id) // Remove se for 1 ou menos
                          } else {
                            updateQuantity(item.nft.id, item.quantity - 1)
                          }}
                      } className="w-8 h-8 md:w-6 md:h-6 rounded-full bg-[#38220F] md:bg-transparent flex items-center justify-center hover:text-primary transition text-primary-accent">
                        <Minus className="w-4 h-4 md:w-3 md:h-3" strokeWidth={2.5} />
                      </button>
                      <span className="text-base md:text-sm font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.nft.id, item.quantity + 1)} className="w-8 h-8 md:w-6 md:h-6 rounded-full bg-[#D28A4C] md:bg-transparent text-ink md:text-fg flex items-center justify-center hover:text-primary transition">
                        <Plus className="w-4 h-4 md:w-3 md:h-3" strokeWidth={2.5} />
                      </button>
                    </div>

                    {/* Total do Item (Só Desktop) */}
                    <span className="hidden md:block text-right font-bold text-sm">{itemTotal.toFixed(2)} ETH</span>

                    {/* Remover */}
                    <button onClick={() => removeItem(item.nft.id)} className="hidden md:flex p-2 text-fg-secondary hover:text-red-500 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* RESUMO DA CARTEIRA */}
          <aside className="w-full lg:w-[380px] shrink-0 px-4 md:px-0 mt-4 md:mt-0">
            <h2 className="hidden md:block text-xl font-bold mb-6">Resumo da carteira</h2>

            {/* Cupom */}
            <div className="mb-6 mt-0 md:mt-0">
              {couponCode ? (
                <div className="flex items-center justify-between bg-surface-card border border-primary/50 p-3 rounded-full text-sm">
                  <span className="text-primary font-bold ml-2">{couponCode} aplicado!</span>
                  <button onClick={removeCoupon} className="text-red-400 hover:text-red-300 mr-2">Remover</button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex bg-[#241612] border border-border rounded-full p-1.5">
                  <input
                    type="text"
                    placeholder="Digite o código promocional..."
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-transparent px-4 py-2 text-sm text-fg focus:outline-none placeholder-fg-secondary"
                  />
                  <button
                    type="submit"
                    disabled={validateCoupon.isPending}
                    className="bg-primary text-ink font-bold px-6 py-2 rounded-full text-sm hover:bg-primary-accent transition disabled:opacity-50"
                  >
                    {validateCoupon.isPending ? '...' : 'Aplicar'}
                  </button>
                </form>
              )}
              {couponError && <p className="text-red-500 text-xs mt-2 ml-4">{couponError}</p>}
            </div>

            {/* Valores */}
            <div className="flex flex-col gap-4 text-base md:text-sm border-b border-border pb-2 mb-6 mt-6 md:mt-8">
              <div className="flex justify-between">
                <span className="text-fg">Subtotal</span>
                <span>{subtotal.toFixed(2)} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fg">Desconto do lançamento</span>
                <span className={discountAmount > 0 ? "text-primary-accent" : "text-fg"}>(-) {discountAmount.toFixed(2)} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fg">Taxa de rede</span>
                <div className="text-right flex flex-col items-end">
                  <span>{networkFee.toFixed(3)} ETH</span>
                  <span className="text-xs text-primary-accent mt-1">Taxa estimada</span>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between font-bold text-xl mb-8">
              <span>Total</span>
              <span className="text-primary-accent">{total.toFixed(3)} ETH</span>
            </div>

            <button
              onClick={() => navigate({ to: '/checkout' })}
              className="w-full bg-primary text-ink font-bold py-4 rounded-full hover:bg-primary-accent transition text-lg md:text-base"
            >
              Conectar e finalizar
            </button>

            <div className="hidden md:block md:text-center md:mt-4">
              <Link to="/" className="text-sm text-primary-accent hover:underline">
                Continuar explorando
              </Link>
            </div>
          </aside>
        </div>

        <div className="hidden sm:block mt-8">
          <MoreFromCollection title="Colecionadores também viram" />
        </div>

        <div className="hidden lg:block mt-8">
          <HomeFooter />
        </div>
      </div>
    </div>
  )
}