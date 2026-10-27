import { useState } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import { useCartStore } from '@/features/cart/useCartStore'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { Loader2, ArrowLeft, Wallet } from 'lucide-react'
import type { Order } from '@/lib/api/types'
import { HomeFooter } from '@/components/HomeFooter'
import { HomeHeader } from '@/components/HomeHeader'

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
})

function CheckoutPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const { items, discountPercentage, clearCart } = useCartStore()

  // Estado do formulário
  const [email, setEmail] = useState(user?.email || '')
  const [name, setName] = useState(user?.name || '')
  const [selectedWallet, setSelectedWallet] = useState('coinbase')
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletConnected, setWalletConnected] = useState(true)
  const [localSearch, setLocalSearch] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({ to: '/', search: { q: localSearch || undefined, page: 1 } })
  }

  const [idempotencyKey] = useState(() => crypto.randomUUID())
  const [errorMsg, setErrorMsg] = useState('')

  if (!user) {
    if (window.innerWidth < 768) {
      navigate({ to: '/login' })
    } else {
      navigate({ to: '/', search: { login: true, page: undefined } })
    }
    return null
  }

  const subtotal = items.reduce((acc, item) => acc + (parseFloat(item.nft.price) * item.quantity), 0)
  const discount = subtotal * (discountPercentage / 100)
  const networkFee = 0.016
  const total = subtotal - discount + networkFee

  const createOrder = useMutation({
    mutationFn: async () => {
      const orderItems = items.map(i => ({
        nftId: i.nft.id,
        name: i.nft.name,
        quantity: i.quantity,
        price: i.nft.price,
        image: i.nft.image
      }))
      const { data } = await api.post<Order>('/orders',
        { items: orderItems, total },
        { headers: { 'Idempotency-Key': idempotencyKey } }
      )
      return data
    },
    onSuccess: (order) => {
      if (order.status === 'failed') {
        setErrorMsg('Pagamento recusado pela carteira. Tente novamente.')
        return
      }
      clearCart()
      navigate({ to: '/order/$id', params: { id: order.id } })
    },
    onError: () => {
      setErrorMsg('Ocorreu um erro ao processar o pedido. Tente novamente.')
    }
  })

  const handleConnectWallet = (walletId: string) => {
    setSelectedWallet(walletId)
    setIsConnecting(true)
    setTimeout(() => {
      setIsConnecting(false)
      setWalletConnected(true)
    }, 1000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!walletConnected) {
      setErrorMsg('Conecte sua carteira primeiro.')
      return
    }
    setErrorMsg('')
    createOrder.mutate()
  }

  // --- COMPONENTE DE CARTEIRAS ---
  // const WalletsSection = () => (
  //   <div className="flex flex-col gap-4">
  //
  //     {/* Header Carteira */}
  //     <div className="flex justify-between items-center">
  //       <h3 className="font-bold text-[15px] md:text-lg text-fg">Carteira conectada</h3>
  //       <span className="text-[#E89B55] text-[15px] font-medium hover:underline cursor-pointer">Trocar carteira</span>
  //     </div>
  //
  //     {/* Card Carteira Reserva */}
  //     <div className="bg-[#241612] border border-[#D28A4C] p-4 rounded-xl flex items-center justify-between w-full">
  //       <div className="flex items-center gap-4">
  //         <div className="w-5 h-5 shrink-0 rounded-full border-2 border-primary flex items-center justify-center">
  //           <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
  //         </div>
  //         <div className="flex flex-col gap-1">
  //           <p className="font-bold text-[15px] md:text-lg text-fg">Reserva</p>
  //           <p className="text-[14px] md:text-sm text-fg-secondary">nova.kurio.eth</p>
  //           <p className="text-[14px] md:text-sm text-fg-secondary">Rede Polygon</p>
  //         </div>
  //       </div>
  //       <div className="flex flex-col gap-1 text-fg-secondary">
  //         <div className="w-1 h-1 bg-current rounded-full"></div>
  //         <div className="w-1 h-1 bg-current rounded-full"></div>
  //         <div className="w-1 h-1 bg-current rounded-full"></div>
  //       </div>
  //     </div>
  //
  //     {/* Card Carteira Principal */}
  //     <div className="bg-[#241612] border border-border p-4 rounded-xl flex items-center justify-between w-full">
  //       <div className="flex items-center gap-4">
  //         <div className="w-5 h-5 shrink-0 rounded-full border border-fg-secondary"></div>
  //         <div className="flex flex-col gap-1">
  //           <p className="font-bold text-[15px] md:text-lg text-fg">Principal</p>
  //           <p className="text-[14px] md:text-sm text-fg-secondary">0xA91F...E82C</p>
  //           <p className="text-[14px] md:text-sm text-fg-secondary">Rede principal Ethereum</p>
  //         </div>
  //       </div>
  //       <div className="flex flex-col gap-1 text-fg-secondary">
  //         <div className="w-1 h-1 bg-current rounded-full"></div>
  //         <div className="w-1 h-1 bg-current rounded-full"></div>
  //         <div className="w-1 h-1 bg-current rounded-full"></div>
  //       </div>
  //     </div>
  //
  //     <h3 className="font-bold text-[15px] md:text-lg mt-2 text-fg">Carteira e rede</h3>
  //
  //     {/* Opções de Carteira Web3 */}
  //     <div className="flex flex-col gap-2 w-full">
  //       {/* WalletConnect */}
  //       <button
  //         type="button"
  //         onClick={() => handleConnectWallet('walletconnect')}
  //         className={`flex items-center justify-between p-4 rounded-xl border transition w-full ${
  //           selectedWallet === 'walletconnect' ? 'border-primary bg-[#241612]' : 'border-border bg-[#1A0F0C] hover:border-fg-secondary'
  //         }`}
  //       >
  //         <div className="flex items-center gap-4">
  //           <div className="w-10 h-10 shrink-0 rounded-full bg-[#38220F] flex items-center justify-center font-bold text-primary-accent">
  //             {isConnecting && selectedWallet === 'walletconnect' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'W'}
  //           </div>
  //           <p className="text-[15px] md:text-lg text-fg">WalletConnect</p>
  //         </div>
  //         <div className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center ${selectedWallet === 'walletconnect' && walletConnected ? 'border-primary' : 'border-fg-secondary'}`}>
  //           {selectedWallet === 'walletconnect' && walletConnected && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
  //         </div>
  //       </button>
  //
  //       {/* MetaMask */}
  //       <button
  //         type="button"
  //         onClick={() => handleConnectWallet('metamask')}
  //         className={`flex items-center justify-between p-4 rounded-xl border transition w-full ${
  //           selectedWallet === 'metamask' ? 'border-primary bg-[#241612]' : 'border-border bg-[#1A0F0C] hover:border-fg-secondary'
  //         }`}
  //       >
  //         <div className="flex items-center gap-4">
  //           <div className="w-10 h-10 shrink-0 rounded-full bg-[#38220F] flex items-center justify-center font-bold text-primary-accent">
  //             {isConnecting && selectedWallet === 'metamask' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'M'}
  //           </div>
  //           <p className="text-[15px] md:text-lg text-fg">MetaMask</p>
  //         </div>
  //         <div className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center ${selectedWallet === 'metamask' && walletConnected ? 'border-primary' : 'border-fg-secondary'}`}>
  //           {selectedWallet === 'metamask' && walletConnected && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
  //         </div>
  //       </button>
  //
  //       {/* Coinbase */}
  //       <button
  //         type="button"
  //         onClick={() => handleConnectWallet('coinbase')}
  //         className={`flex items-center justify-between p-4 rounded-xl border transition w-full ${
  //           selectedWallet === 'coinbase' ? 'border-primary bg-[#241612]' : 'border-border bg-[#1A0F0C] hover:border-fg-secondary'
  //         }`}
  //       >
  //         <div className="flex items-center gap-4">
  //           <div className="w-10 h-10 shrink-0 rounded-full bg-[#38220F] flex items-center justify-center font-bold text-primary-accent">
  //             {isConnecting && selectedWallet === 'coinbase' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wallet className="w-5 h-5" />}
  //           </div>
  //           <p className="text-[15px] md:text-lg text-fg">Coinbase Wallet</p>
  //         </div>
  //         <div className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center ${selectedWallet === 'coinbase' && walletConnected ? 'border-primary' : 'border-fg-secondary'}`}>
  //           {selectedWallet === 'coinbase' && walletConnected && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
  //         </div>
  //       </button>
  //     </div>
  //
  //     {/* TOTAL NO MOBILE (Rola junto com os cards) */}
  //     <div className="md:hidden flex justify-end items-center gap-2 mt-4">
  //       <span className="text-[15px] text-fg">Total:</span>
  //       <span className="font-bold text-[20px] text-[#D28A4C]">{total.toFixed(3)} ETH</span>
  //     </div>
  //
  //     {errorMsg && <div className="md:hidden text-red-500 text-sm text-center mt-2">{errorMsg}</div>}
  //   </div>
  // )

  const ConnectedWallets = () => (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-[15px] md:text-lg text-fg">Carteira conectada</h3>
        <span className="text-[#E89B55] text-[15px] font-medium hover:underline cursor-pointer">Trocar carteira</span>
      </div>

      {/* Card Reserva */}
      <div className="bg-[#241612] border border-[#D28A4C] p-4 rounded-xl flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <div className="w-5 h-5 shrink-0 rounded-full border-2 border-primary flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-bold text-[15px] md:text-lg text-fg">Reserva</p>
            <p className="text-[14px] md:text-sm text-fg-secondary">nova.kurio.eth</p>
            <p className="text-[14px] md:text-sm text-fg-secondary">Rede Polygon</p>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-fg-secondary">
          <div className="w-1 h-1 bg-current rounded-full"></div>
          <div className="w-1 h-1 bg-current rounded-full"></div>
          <div className="w-1 h-1 bg-current rounded-full"></div>
        </div>
      </div>

      {/* Card Principal */}
      <div className="bg-[#241612] border border-border p-4 rounded-xl flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <div className="w-5 h-5 shrink-0 rounded-full border border-fg-secondary"></div>
          <div className="flex flex-col gap-1">
            <p className="font-bold text-[15px] md:text-lg text-fg">Principal</p>
            <p className="text-[14px] md:text-sm text-fg-secondary">0xA91F...E82C</p>
            <p className="text-[14px] md:text-sm text-fg-secondary">Rede principal Ethereum</p>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-fg-secondary">
          <div className="w-1 h-1 bg-current rounded-full"></div>
          <div className="w-1 h-1 bg-current rounded-full"></div>
          <div className="w-1 h-1 bg-current rounded-full"></div>
        </div>
      </div>
    </div>
  )

  // --- WEB3 WALLETS (Botões de conexão) ---
  const Web3Wallets = () => (
    <div className="flex flex-col gap-2 w-full">
      {/* WalletConnect */}
      <button
        type="button"
        onClick={() => handleConnectWallet('walletconnect')}
        className={`flex items-center justify-between p-4 rounded-xl border transition w-full ${
          selectedWallet === 'walletconnect' ? 'border-primary bg-[#241612]' : 'border-border bg-[#1A0F0C] hover:border-fg-secondary'
        }`}
      >
        <div className="flex items-center gap-4">
          {/* Checkbox à esquerda */}
          <div className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center ${selectedWallet === 'walletconnect' && walletConnected ? 'border-primary' : 'border-fg-secondary'}`}>
            {selectedWallet === 'walletconnect' && walletConnected && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
          </div>

          <div className="w-10 h-10 shrink-0 rounded-full bg-[#38220F] flex items-center justify-center font-bold text-primary-accent">
            {isConnecting && selectedWallet === 'walletconnect' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'W'}
          </div>
          <p className="text-[15px] md:text-lg text-fg">WalletConnect</p>
        </div>
      </button>

      {/* MetaMask */}
      <button
        type="button"
        onClick={() => handleConnectWallet('metamask')}
        className={`flex items-center justify-between p-4 rounded-xl border transition w-full ${
          selectedWallet === 'metamask' ? 'border-primary bg-[#241612]' : 'border-border bg-[#1A0F0C] hover:border-fg-secondary'
        }`}
      >
        <div className="flex items-center gap-4">
          {/* Checkbox à esquerda */}
          <div className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center ${selectedWallet === 'metamask' && walletConnected ? 'border-primary' : 'border-fg-secondary'}`}>
            {selectedWallet === 'metamask' && walletConnected && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
          </div>

          <div className="w-10 h-10 shrink-0 rounded-full bg-[#38220F] flex items-center justify-center font-bold text-primary-accent">
            {isConnecting && selectedWallet === 'metamask' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'M'}
          </div>
          <p className="text-[15px] md:text-lg text-fg">MetaMask</p>
        </div>
      </button>

      {/* Coinbase */}
      <button
        type="button"
        onClick={() => handleConnectWallet('coinbase')}
        className={`flex items-center justify-between p-4 rounded-xl border transition w-full ${
          selectedWallet === 'coinbase' ? 'border-primary bg-[#241612]' : 'border-border bg-[#1A0F0C] hover:border-fg-secondary'
        }`}
      >
        <div className="flex items-center gap-4">
          {/* Checkbox à esquerda */}
          <div className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center ${selectedWallet === 'coinbase' && walletConnected ? 'border-primary' : 'border-fg-secondary'}`}>
            {selectedWallet === 'coinbase' && walletConnected && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
          </div>

          <div className="w-10 h-10 shrink-0 rounded-full bg-[#38220F] flex items-center justify-center font-bold text-primary-accent">
            {isConnecting && selectedWallet === 'coinbase' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wallet className="w-5 h-5" />}
          </div>
          <p className="text-[15px] md:text-lg text-fg">Coinbase Wallet</p>
        </div>
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-ink text-fg pb-32 md:pb-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-4 md:py-8 flex flex-col gap-8 md:gap-12">

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

        {/* HEADER MOBILE */}
        <div className="md:hidden flex items-center gap-4 mb-2">
          <button onClick={() => navigate({ to: '/cart' })} className="w-10 h-10 bg-surface-card rounded-full flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-fg" />
          </button>
          <h1 className="text-xl font-bold">Pagamento com carteira</h1>
        </div>

        {/* BREADCRUMB DESKTOP */}
        <nav className="hidden md:flex text-sm text-fg-secondary gap-2 items-center">
          <Link to="/" className="hover:text-fg">Início</Link> <span>/</span>
          <span className="text-fg-secondary">Mercado</span> <span>/</span>
          <span className="text-fg">Pagamento</span>
        </nav>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-12">

          {/* COLUNA ESQUERDA: FORMULÁRIO (Só Desktop) */}
          <div className="hidden md:flex flex-1 flex-col gap-8">
            <h2 className="text-xl font-bold">Perfil do colecionador</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm text-fg">Nome de exibição <span className="text-primary-accent">*</span></label>
                <input value={name} onChange={e => setName(e.target.value)} className="bg-transparent border border-border p-3 rounded-md text-fg focus:border-primary outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-fg">Nome de usuário <span className="text-primary-accent">*</span></label>
                <input className="bg-transparent border border-border p-3 rounded-md text-fg focus:border-primary outline-none" placeholder="@" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-fg">Rede <span className="text-primary-accent">*</span></label>
                <select className="bg-transparent border border-border p-3 rounded-md text-fg-secondary focus:border-primary outline-none appearance-none">
                  <option value="" disabled>Selecione uma rede</option>
                  <option value="ethereum">Ethereum</option>
                  <option value="polygon">Polygon</option>
                  <option value="solana">Solana</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-fg">Nome do perfil <span className="text-primary-accent">*</span></label>
                <input className="bg-transparent border border-border p-3 rounded-md text-fg focus:border-primary outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-fg">Endereço da carteira <span className="text-primary-accent">*</span></label>
                <input className="bg-transparent border border-border p-3 rounded-md text-fg focus:border-primary outline-none placeholder-fg-secondary" placeholder="Endereço 0x da carteira" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-fg invisible">Carteira Secundária</label>
                <input className="bg-transparent border border-border p-3 rounded-md text-fg focus:border-primary outline-none placeholder-fg-secondary" placeholder="ENS ou carteira secundária (opcional)" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-fg">Tipo de carteira <span className="text-primary-accent">*</span></label>
                <select className="bg-transparent border border-border p-3 rounded-md text-fg-secondary focus:border-primary outline-none appearance-none">
                  <option value="" disabled>Selecione uma carteira</option>
                  <option value="metamask">MetaMask</option>
                  <option value="walletconnect">WalletConnect</option>
                  <option value="coinbase">Coinbase</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-fg">Código de indicação <span className="text-primary-accent">*</span></label>
                <input className="bg-transparent border border-border p-3 rounded-md text-fg focus:border-primary outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-fg">E-mail <span className="text-primary-accent">*</span></label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-transparent border border-border p-3 rounded-md text-fg focus:border-primary outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-fg">Nome ENS <span className="text-primary-accent">*</span></label>
                <div className="flex">
                  <select className="bg-transparent border border-border border-r-0 p-3 rounded-l text-fg outline-none">
                    <option>.eth</option>
                  </select>
                  <input className="flex-1 bg-transparent border border-border p-3 rounded-r text-fg focus:border-primary outline-none" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4 rounded-full border-primary accent-primary" />
                <span className="text-sm text-fg">Usar outra carteira?</span>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-fg">Observação do colecionador (opcional)</label>
                <textarea className="bg-transparent border border-border p-3 rounded-md text-fg focus:border-primary outline-none h-32 resize-none" />
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA: RESUMO (Só Desktop) */}
          <aside className="hidden lg:flex w-[380px] shrink-0 flex-col gap-6">

            {/* Seus NFTs */}
            <div>
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Seus NFTs</h3>
              </div>
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#D28A4C]">
                <h3 className="font-bold text-lg">NFTs</h3>
                <span className="text-sm text-fg-primary">Subtotal</span>
              </div>

              <div className="flex flex-col gap-3">
                {items.map(item => (
                  <div key={item.nft.id} className="flex gap-3 items-center">
                    <img src={item.nft.image} className="w-12 h-12 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{item.nft.name}</p>
                      <p className="text-xs text-fg-secondary">(x {item.quantity})</p>
                    </div>
                    <span className="font-bold text-sm text-primary-accent">{(parseFloat(item.nft.price) * item.quantity).toFixed(2)} ETH</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cupom */}
            <div>
              <p className="text-sm text-fg-secondary mb-2">Tem um código promocional? Aplique aqui</p>
              <div className="flex">
                <input placeholder="Digite o código promocional..." className="flex-1 bg-transparent border border-border p-2 rounded-l text-sm text-fg outline-none" />
                <button className="bg-primary text-ink font-bold px-4 py-2 rounded-r text-sm">Aplicar</button>
              </div>
            </div>

            {/* Valores */}
            <div className="flex flex-col gap-2 text-sm pt-4 border-b border-[#D28A4C]">
              <div className="flex justify-between text-fg-primary">
                <span>Subtotal</span> <span>{subtotal.toFixed(2)} ETH</span>
              </div>
              <div className="flex justify-between text-fg-primary">
                <span>Desconto do lançamento</span> <span className="text-fg-primary">(-) {discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-fg-primary">
                <span>Taxa de rede</span>
                <div className="flex flex-col items-end">
                  <span>{networkFee.toFixed(3)} ETH</span>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-sm text-[#D28A4C] mt-1">Taxa estimada</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between font-bold text-lg text-fg mt-2">
              <span>Total</span> <span className="text-primary-accent">{total.toFixed(3)} ETH</span>
            </div>

            {/* Carteira e rede (Apenas Web3 no desktop) */}
            <div className="flex flex-col gap-4 mt-2">
              <h3 className="font-bold text-[15px] md:text-lg text-fg text-center">Carteira e rede</h3>
              <Web3Wallets />
            </div>

            {/* Botão Confirmar */}
            <button
              type="submit"
              disabled={createOrder.isPending || !walletConnected}
              className="w-full bg-primary text-ink font-bold py-4 rounded-lg hover:bg-primary-accent transition disabled:opacity-50 flex justify-center items-center gap-2 mt-2"
            >
              {createOrder.isPending ? <><Loader2 className="w-5 h-5 animate-spin" /> Processando...</> : 'Confirmar compra'}
            </button>
          </aside>

          {/* CARTEIRAS NO MOBILE */}
          <div className="md:hidden w-full flex flex-col gap-6">
            <ConnectedWallets />

            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-[15px] md:text-lg text-fg mt-2">Carteira e rede</h3>
              <Web3Wallets />
            </div>

            {/* Total Mobile */}
            <div className="flex justify-end items-center gap-2 mt-4">
              <span className="text-[15px] text-fg">Total:</span>
              <span className="font-bold text-[20px] text-[#D28A4C]">{total.toFixed(3)} ETH</span>
            </div>

            {errorMsg && <div className="text-red-500 text-sm text-center mt-2">{errorMsg}</div>}
          </div>
        </form>

        <div className="hidden md:block mt-12">
          <HomeFooter />
        </div>
      </div>

      {/* BARRA FIXA MOBILE (Apenas Botão) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#140D0A] p-5 z-50 rounded-t-3xl shadow-[0_-10px_30px_rgba(20,13,10,0.95)] border-t border-border/50">
        <button
          onClick={handleSubmit}
          disabled={createOrder.isPending || !walletConnected}
          className="w-full bg-[#D28A4C] text-[#140D0A] font-bold py-4 rounded-full text-[18px] hover:bg-[#E89B55] transition disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {createOrder.isPending ? <><Loader2 className="w-5 h-5 animate-spin" /> Processando...</> : 'Confirmar compra'}
        </button>
      </div>
    </div>
  )
}