import { useState } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { useCartStore } from '@/features/cart/useCartStore'
import {
  User, Wallet, Activity, Heart, Tag, Download,
  LifeBuoy, LogOut
} from 'lucide-react'
import { HomeHeader } from '@/components/HomeHeader'

export const Route = createFileRoute('/wallets')({
  component: WalletsPage,
})

function WalletsPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const clearCart = useCartStore((state) => state.clearCart)
  const [localSearch, setLocalSearch] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({ to: '/', search: { q: localSearch || undefined, page: 1 } })
  }

  // Estados do formulário da carteira principal
  const [displayName, setDisplayName] = useState('')
  const [walletNickname, setWalletNickname] = useState('')
  const [network, setNetwork] = useState('')
  const [profileName, setProfileName] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [ens, setEns] = useState('')
  const [walletType, setWalletType] = useState('')
  const [referralCode, setReferralCode] = useState('')
  const [email, setEmail] = useState('')
  const [ensName, setEnsName] = useState('')

  const [hasSecondaryWallet, setHasSecondaryWallet] = useState(false)

  if (!user) {
    navigate({ to: '/' })
    return null
  }

  const handleLogout = () => {
    logout()
    clearCart()
    navigate({ to: '/' })
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Carteira salva com sucesso (Simulação)')
  }

  return (
    <div className="min-h-screen bg-ink text-fg pb-20">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-4 md:py-8 flex flex-col gap-8 md:gap-12">

        {/* HEADER */}
        <HomeHeader
          localSearch={localSearch}
          setLocalSearch={setLocalSearch}
          handleSearch={handleSearch}
          onOpenLogin={() => {}}
          activeTab="inicio"
        />

        {/* CONTAINER DE DUAS COLUNAS (Sidebar + Conteúdo) */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12">

          {/* SIDEBAR */}
          <aside className="w-full md:w-[280px] shrink-0">
            <div className="bg-surface-card rounded-lg p-6 flex flex-col gap-2">
              <h2 className="text-xl font-bold mb-4">Meu perfil</h2>

              <Link to="/profile" className="flex items-center gap-3 text-fg-secondary hover:text-fg pl-3 py-2 text-left transition">
                <User className="w-5 h-5" /> Dados do perfil
              </Link>

              <button className="flex items-center gap-3 text-primary-accent font-medium border-l-2 border-primary pl-3 py-2 text-left">
                <Wallet className="w-5 h-5" /> Carteiras
              </button>

              <button className="flex items-center gap-3 text-fg-secondary hover:text-fg pl-3 py-2 text-left transition">
                <Activity className="w-5 h-5" /> Atividade
              </button>
              <button className="flex items-center gap-3 text-fg-secondary hover:text-fg pl-3 py-2 text-left transition">
                <Heart className="w-5 h-5" /> Lista de interesse
              </button>
              <button className="flex items-center gap-3 text-fg-secondary hover:text-fg pl-3 py-2 text-left transition">
                <Tag className="w-5 h-5" /> Ofertas
              </button>
              <button className="flex items-center gap-3 text-fg-secondary hover:text-fg pl-3 py-2 text-left transition">
                <Download className="w-5 h-5" /> Arquivos baixados
              </button>
              <button className="flex items-center gap-3 text-fg-secondary hover:text-fg pl-3 py-2 text-left transition">
                <LifeBuoy className="w-5 h-5" /> Suporte
              </button>

              <div className="border-t border-border mt-2 pt-2">
                <button onClick={handleLogout} className="flex items-center gap-3 text-fg hover:text-red-500 pl-3 py-2 text-left transition w-full">
                  <LogOut className="w-5 h-5" /> Sair
                </button>
              </div>
            </div>
          </aside>

          {/* CONTEÚDO PRINCIPAL */}
          <main className="flex-1 min-w-0">
            {/* Header Carteira Principal */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-2xl font-bold mb-2">Carteira principal</h1>
                <p className="text-sm text-fg-secondary">
                  Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.
                </p>
              </div>
              <button className="text-primary-accent hover:underline text-sm font-medium mt-1">Adicionar</button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Nome de exibição <span className="text-primary-accent">*</span></label>
                  <input
                    type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
                    className="bg-transparent border border-border p-3 rounded text-fg focus:border-primary outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Apelido da carteira <span className="text-primary-accent">*</span></label>
                  <input
                    type="text" value={walletNickname} onChange={e => setWalletNickname(e.target.value)}
                    className="bg-transparent border border-border p-3 rounded text-fg focus:border-primary outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Rede <span className="text-primary-accent">*</span></label>
                  <select
                    value={network} onChange={e => setNetwork(e.target.value)}
                    className="bg-transparent border border-border p-3 rounded text-fg focus:border-primary outline-none appearance-none"
                  >
                    <option value="" disabled>Selecione uma rede</option>
                    <option value="ethereum">Ethereum</option>
                    <option value="polygon">Polygon</option>
                    <option value="solana">Solana</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Nome do perfil <span className="text-primary-accent">*</span></label>
                  <input
                    type="text" value={profileName} onChange={e => setProfileName(e.target.value)}
                    className="bg-transparent border border-border p-3 rounded text-fg focus:border-primary outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Endereço da carteira <span className="text-primary-accent">*</span></label>
                  <input
                    type="text" value={walletAddress} onChange={e => setWalletAddress(e.target.value)} placeholder="Endereço 0x da carteira"
                    className="bg-transparent border border-border p-3 rounded text-fg focus:border-primary outline-none placeholder-fg-secondary"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium invisible">ENS</label>
                  <input
                    type="text" value={ens} onChange={e => setEns(e.target.value)} placeholder="ENS ou carteira secundária (opcional)"
                    className="bg-transparent border border-border p-3 rounded text-fg focus:border-primary outline-none placeholder-fg-secondary"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Tipo de carteira <span className="text-primary-accent">*</span></label>
                  <select
                    value={walletType} onChange={e => setWalletType(e.target.value)}
                    className="bg-transparent border border-border p-3 rounded text-fg focus:border-primary outline-none appearance-none"
                  >
                    <option value="" disabled>Selecione uma carteira</option>
                    <option value="metamask">MetaMask</option>
                    <option value="walletconnect">WalletConnect</option>
                    <option value="coinbase">Coinbase Wallet</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Código de indicação <span className="text-primary-accent">*</span></label>
                  <input
                    type="text" value={referralCode} onChange={e => setReferralCode(e.target.value)}
                    className="bg-transparent border border-border p-3 rounded text-fg focus:border-primary outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">E-mail <span className="text-primary-accent">*</span></label>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="bg-transparent border border-border p-3 rounded text-fg focus:border-primary outline-none"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Nome ENS <span className="text-primary-accent">*</span></label>
                  <div className="flex">
                    <select className="bg-transparent border border-border border-r-0 p-3 rounded-l text-fg outline-none">
                      <option>.eth</option>
                    </select>
                    <input
                      type="text" value={ensName} onChange={e => setEnsName(e.target.value)}
                      className="flex-1 bg-transparent border border-border p-3 rounded-r text-fg focus:border-primary outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <button type="submit" className="bg-primary text-ink font-bold px-6 py-3 rounded hover:bg-primary-accent transition">
                  Salvar carteira
                </button>
              </div>
            </form>

            {/* Carteira Secundária */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Carteira secundária</h2>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-fg-secondary cursor-pointer">
                    <input
                      type="radio"
                      checked={hasSecondaryWallet}
                      onChange={() => setHasSecondaryWallet(!hasSecondaryWallet)}
                      className="accent-primary"
                    />
                    Igual à carteira principal
                  </label>
                  <button type="button" className="text-primary-accent hover:underline text-sm font-medium">Adicionar</button>
                </div>
              </div>

              {!hasSecondaryWallet && (
                <p className="text-sm text-fg-secondary">
                  Você ainda não adicionou uma carteira secundária.
                </p>
              )}

              {hasSecondaryWallet && (
                <div className="p-4 bg-surface-card rounded border border-border text-sm mt-4">
                  <p className="text-fg">Carteira secundária vinculada à principal.</p>
                </div>
              )}
            </div>

          </main>
        </div>
      </div>
    </div>
  )
}