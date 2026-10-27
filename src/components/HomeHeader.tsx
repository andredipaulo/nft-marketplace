import { Link } from '@tanstack/react-router'
import { ShoppingCart, Search, SlidersHorizontal } from 'lucide-react'
import { useAuthStore } from '@/features/auth/useAuthStore'
import { useCartStore } from '@/features/cart/useCartStore'

interface HomeHeaderProps {
  localSearch: string
  setLocalSearch: (val: string) => void
  handleSearch: (e: React.FormEvent) => void
  onOpenLogin: () => void
  activeTab?: 'inicio' | 'mercado' | 'criadores' | 'aprenda' // NOVA PROP
}

export function HomeHeader({
 localSearch, setLocalSearch, handleSearch, onOpenLogin,
 activeTab = 'inicio' // Valor padrão é 'inicio'
}: HomeHeaderProps) {
  const user = useAuthStore((state) => state.user)
  const cartCount = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0))

  // Função para facilitar a aplicação das classes ativas
  const getTabClass = (tab: string) => {
    return activeTab === tab
      ? 'text-primary-accent font-bold border-b-2 border-primary pb-2'
      : 'text-fg pb-2 hover:text-primary-accent transition border-b-2 border-transparent'
  }

  return (
    <>
      {/* HEADER DESKTOP */}
      <header className="hidden md:flex items-center justify-between border-b border-border pb-4">
        <Link to="/" className="text-xl font-bold tracking-[0.1em] text-fg">KURIO</Link>
        <nav className="flex gap-8 text-base">
          <Link to="/" className={getTabClass('inicio')}>Início</Link>
          <Link to="/" search={{ q: undefined, page: 1 }} className={getTabClass('mercado')}>Mercado</Link>
          <span className={getTabClass('criadores')}>Criadores</span>
          <span className={getTabClass('aprenda')}>Aprenda</span>
        </nav>
        <div className="flex items-center gap-6">
          <Link to="/cart" className="relative hover:text-primary transition">
            <ShoppingCart className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-ink text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <Link to="/profile" className="bg-surface-card border border-border px-4 py-1.5 rounded-md text-sm font-medium hover:border-primary transition">
              {user.name.split(' ')[0]}
            </Link>
          ) : (
            <>
              <Link to="/login" className="md:hidden bg-primary text-ink px-4 py-1.5 rounded-md font-medium text-sm">
                Entrar
              </Link>
              <button onClick={onOpenLogin} className="hidden md:block bg-primary text-ink px-4 py-1.5 rounded-md font-medium text-sm hover:bg-primary-accent transition">
                Entrar
              </button>
            </>
          )}
        </div>
      </header>

      {/* HEADER MOBILE */}
      <div className="md:hidden flex gap-2 items-center">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-fg-secondary" />
          <input
            type="text"
            placeholder="Explorar coleções"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full bg-surface-card border border-border rounded-lg pl-10 pr-4 py-3 text-fg focus:border-primary outline-none"
          />
        </form>
        <button className="bg-primary text-ink p-3 rounded-lg">
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>
    </>
  )
}