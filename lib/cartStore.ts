import { create } from "zustand";
import type { CartItem, Product } from "@/types/product";

interface AddItemInput {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity?: number;
}

interface CartStore {
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (input: AddItemInput) => void;
  removeItem: (id: string, selectedColor: string, selectedSize: string) => void;
  updateQty: (id: string, selectedColor: string, selectedSize: string, quantity: number) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  cart: [],
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  addItem: ({ product, selectedColor, selectedSize, quantity = 1 }) =>
    set((state) => {
      const existingItem = state.cart.find(
        (item) =>
          item.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize,
      );

      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          ),
          isCartOpen: true, // Automatically open cart on add
        };
      }

      return {
        cart: [
          ...state.cart,
          {
            ...product,
            selectedColor,
            selectedSize,
            quantity,
          },
        ],
        isCartOpen: true,
      };
    }),
  removeItem: (id, selectedColor, selectedSize) =>
    set((state) => ({
      cart: state.cart.filter(
        (item) =>
          item.id !== id ||
          item.selectedColor !== selectedColor ||
          item.selectedSize !== selectedSize,
      ),
    })),
  updateQty: (id, selectedColor, selectedSize, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id && item.selectedColor === selectedColor && item.selectedSize === selectedSize
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      ),
    })),
}));

export const useTotalQuantity = () =>
  useCartStore((state) => state.cart.reduce((sum, item) => sum + item.quantity, 0));

export const useSubtotal = () =>
  useCartStore((state) => state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
