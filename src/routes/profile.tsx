import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { useCartStore } from '@/features/cart/useCartStore'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api/client'
import {
  User, Heart, Download,
  LogOut, Eye, EyeOff, Loader2, ShoppingCart, MapPin,
  LucideActivitySquare, AlertTriangle
} from 'lucide-react'
import { HomeHeader } from '@/components/HomeHeader'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const clearCart = useCartStore((state) => state.clearCart)

  // Estados do Formulário
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [username, setUsername] = useState('colecionador_kurio')
  const [ens, setEns] = useState('')
  const [walletName, setWalletName] = useState('Minha MetaMask')

  // Estados de Senha
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [localSearch, setLocalSearch] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({ to: '/', search: { q: localSearch || undefined, page: 1 } })
  }

  if (!user) {
    navigate({ to: '/' })
    return null
  }

  const handleLogout = () => {
    logout()
    clearCart()
    navigate({ to: '/' })
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      await api.patch('/profile', { name, email })
    },
    onSuccess: () => {
      setSuccessMsg('Perfil atualizado com sucesso!')
      setTimeout(() => setSuccessMsg(''), 3000)
    }
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    saveMutation.mutate()
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

              <button className="flex items-center gap-3 text-primary-accent font-medium border-l-2 border-primary pl-3 py-2 text-left">
                <User className="w-5 h-5" /> Dados do perfil
              </button>
              <Link to="/wallets" className="flex items-center gap-3 text-fg-secondary hover:text-fg pl-3 py-2 text-left transition">
                <MapPin className="w-5 h-5" /> Carteiras
              </Link>
              <button className="flex items-center gap-3 text-fg-secondary hover:text-fg pl-3 py-2 text-left transition">
                <ShoppingCart className="w-5 h-5" /> Atividade
              </button>
              <button className="flex items-center gap-3 text-fg-secondary hover:text-fg pl-3 py-2 text-left transition">
                <Heart className="w-5 h-5" /> Lista de interesse
              </button>
              <button className="flex items-center gap-3 text-fg-secondary hover:text-fg pl-3 py-2 text-left transition">
                <LucideActivitySquare className="w-5 h-5" /> Ofertas
              </button>
              <button className="flex items-center gap-3 text-fg-secondary hover:text-fg pl-3 py-2 text-left transition">
                <Download className="w-5 h-5" /> Arquivos baixados
              </button>
              <button className="flex items-center gap-3 text-fg-secondary hover:text-fg pl-3 py-2 text-left transition">
                <AlertTriangle className="w-5 h-5" /> Suporte
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
            <h1 className="text-2xl font-bold mb-8">Perfil do colecionador</h1>

            <form onSubmit={handleSave} className="flex flex-col gap-8">

              {/* Dados Básicos (Grid de 2 colunas) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Nome de exibição <span className="text-primary-accent">*</span></label>
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)}
                    className="bg-transparent border border-border p-3 rounded text-fg focus:border-primary outline-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Nome de usuário <span className="text-primary-accent">*</span></label>
                  <input
                    type="text" value={username} onChange={e => setUsername(e.target.value)}
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
                      type="text" value={ens} onChange={e => setEns(e.target.value)}
                      className="flex-1 bg-transparent border border-border p-3 rounded-r text-fg focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Apelido da carteira <span className="text-primary-accent">*</span></label>
                  <input
                    type="text" value={walletName} onChange={e => setWalletName(e.target.value)}
                    className="bg-transparent border border-border p-3 rounded text-fg focus:border-primary outline-none"
                  />
                </div>

                {/* Avatar */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Avatar</label>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface-card rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-fg-secondary" />
                    </div>
                    <button type="button" className="bg-primary text-ink px-4 py-2 rounded text-sm font-bold hover:bg-primary hover:text-ink transition">
                      Alterar
                    </button>
                    <button type="button" className="text-fg-primary text-sm hover:text-fg">
                      Remover
                    </button>
                  </div>
                </div>
              </div>

              {/* Alterar Senha */}
              <div className="mt-4 border-t border-border pt-8">
                <h2 className="text-lg font-bold mb-6">Alterar senha</h2>

                {/* Mudamos para flex-col e max-w-md para ficar em coluna e ocupar meia tela */}
                <div className="flex flex-col gap-6 max-w-md">
                  <div className="relative">
                    <label className="text-sm font-medium block mb-2">Senha atual</label>
                    <input
                      type={showCurrent ? "text" : "password"}
                      value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                      className="w-full bg-transparent border border-border p-3 rounded text-fg focus:border-primary outline-none pr-10"
                    />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 bottom-3 text-fg-secondary hover:text-fg">
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="relative">
                    <label className="text-sm font-medium block mb-2">Nova senha</label>
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword} onChange={e => setNewPassword(e.target.value)}
                      className="w-full bg-transparent border border-border p-3 rounded text-fg focus:border-primary outline-none pr-10"
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 bottom-3 text-fg-secondary hover:text-fg">
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="relative">
                    <label className="text-sm font-medium block mb-2">Confirmar nova senha</label>
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full bg-transparent border border-border p-3 rounded text-fg focus:border-primary outline-none pr-10"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 bottom-3 text-fg-secondary hover:text-fg">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer do Form */}
              <div className="flex items-center gap-4 mt-4">
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="bg-primary text-ink font-bold px-8 py-3 rounded hover:bg-primary-accent transition flex items-center gap-2"
                >
                  {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Salvar
                </button>
                {successMsg && <span className="text-green-500 text-sm">{successMsg}</span>}
              </div>

            </form>
          </main>
        </div>
      </div>
    </div>
  )
}