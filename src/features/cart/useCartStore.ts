import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { NFT } from '@/lib/api/types'

export interface CartItem {
  nft: NFT
  quantity: number
}

interface CartStore {
  items: CartItem[]
  discountPercentage: number
  couponCode: string
  addItem: (nft: NFT, quantity: number) => void
  removeItem: (nftId: string) => void
  updateQuantity: (nftId: string, quantity: number) => void
  applyCoupon: (code: string, discount: number) => void
  removeCoupon: () => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      discountPercentage: 0,
      couponCode: '',
      addItem: (nft, quantity) => set((state) => {
        const existing = state.items.find((i) => i.nft.id === nft.id)
        if (existing) {
          return {
            items: state.items.map((i) =>
              i.nft.id === nft.id ? { ...i, quantity: i.quantity + quantity } : i
            ),
          }
        }
        return { items: [...state.items, { nft, quantity }] }
      }),
      removeItem: (nftId) => set((state) => ({
        items: state.items.filter((i) => i.nft.id !== nftId)
      })),
      updateQuantity: (nftId, quantity) => set((state) => ({
        items: state.items.map((i) =>
          i.nft.id === nftId ? { ...i, quantity: Math.max(1, quantity) } : i
        )
      })),
      applyCoupon: (code, discount) => set({ couponCode: code, discountPercentage: discount }),
      removeCoupon: () => set({ couponCode: '', discountPercentage: 0 }),
      clearCart: () => set({ items: [], discountPercentage: 0, couponCode: '' }),
    }),
    { name: 'kurio-cart' }
  )
)