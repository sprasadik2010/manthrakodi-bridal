// src/store/wishlistStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

interface WishlistStore {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToWishlist: (product) => {
        const { items } = get();
        if (!items.some(item => item.id === product.id)) {
          set({ items: [...items, product] });
        }
      },
      removeFromWishlist: (productId) => {
        set(state => ({
          items: state.items.filter(item => item.id !== productId)
        }));
      },
      isInWishlist: (productId) => {
        return get().items.some(item => item.id === productId);
      },
      clearWishlist: () => set({ items: [] })
    }),
    {
      name: 'wishlist-storage',
    }
  )
);

// Export as default
export default useWishlistStore;