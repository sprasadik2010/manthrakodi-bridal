// src/store/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface CartStore {
  items: CartItem[];
  total: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      
      addToCart: (product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find(item => item.product.id === product.id);
        
        if (existingItem) {
          set(state => ({
            items: state.items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
            total: state.total + (product.price * quantity)
          }));
        } else {
          set(state => ({
            items: [...state.items, { product, quantity }],
            total: state.total + (product.price * quantity)
          }));
        }
      },
      
      removeFromCart: (productId) => {
        const { items } = get();
        const itemToRemove = items.find(item => item.product.id === productId);
        
        set(state => ({
          items: state.items.filter(item => item.product.id !== productId),
          total: state.total - (itemToRemove ? itemToRemove.product.price * itemToRemove.quantity : 0)
        }));
      },
      
      updateQuantity: (productId, quantity) => {
        const { items } = get();
        const item = items.find(item => item.product.id === productId);
        
        if (!item) return;
        
        const quantityDiff = quantity - item.quantity;
        set(state => ({
          items: state.items.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          ),
          total: state.total + (item.product.price * quantityDiff)
        }));
      },
      
      clearCart: () => {
        set({ items: [], total: 0 });
      },
      
      getCartCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);

// Make sure to export as default
export default useCartStore;