import { Link, useLocation } from '@tanstack/react-router'
import { Home, Heart, ShoppingCart, User, Plus } from 'lucide-react'
import { useCartStore } from '@/features/cart/useCartStore'
import { useAuthStore } from '@/features/auth/useAuthStore'

export function MobileNav() {
  const location = useLocation()
  const cartCount = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0))
  const user = useAuthStore((state) => state.user)
  const isHome = location.pathname === '/'

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1A0F0C] border-t border-border flex justify-around items-center h-16 px-4 pb-safe">
      <Link to="/" className={`p-2 ${isHome ? 'text-primary-accent' : 'text-fg-secondary'}`}>
        <Home className="w-6 h-6" />
      </Link>

      <button className="p-2 text-fg-secondary">
        <Heart className="w-6 h-6" />
      </button>

      {/* Botão central flutuante (Scan/Mint) */}
      <div className="relative -top-4">
        <button className="w-14 h-14 bg-primary text-ink rounded-full flex items-center justify-center shadow-lg border-4 border-ink">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <Link to="/cart" className={`p-2 relative ${location.pathname === '/cart' ? 'text-primary-accent' : 'text-fg-secondary'}`}>
        <ShoppingCart className="w-6 h-6" />
        {cartCount > 0 && (
          <span className="absolute top-1 right-0 bg-primary text-ink text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
            {cartCount}
          </span>
        )}
      </Link>

      <Link to={user ? "/profile" : "/"} className={`p-2 ${location.pathname === '/profile' ? 'text-primary-accent' : 'text-fg-secondary'}`}>
        <User className="w-6 h-6" />
      </Link>
    </div>
  )
}