import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/features/products/types';

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      
      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id);
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
              total: state.total + product.price,
            };
          }
          
          return {
            items: [...state.items, { ...product, quantity: 1 }],
            total: state.total + product.price,
          };
        }),
      
      removeItem: (productId) =>
        set((state) => {
          const item = state.items.find((item) => item.id === productId);
          if (!item) return state;
          
          return {
            items: state.items.filter((item) => item.id !== productId),
            total: state.total - item.price * item.quantity,
          };
        }),
      
      updateQuantity: (productId, quantity) =>
        set((state) => {
          const item = state.items.find((item) => item.id === productId);
          if (!item) return state;
          
          if (quantity <= 0) {
            return get().removeItem(productId), state;
          }
          
          const priceDiff = (quantity - item.quantity) * item.price;
          
          return {
            items: state.items.map((item) =>
              item.id === productId ? { ...item, quantity } : item
            ),
            total: state.total + priceDiff,
          };
        }),
      
      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: 'cart-storage',
    }
  )
);