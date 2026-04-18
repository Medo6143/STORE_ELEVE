import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CartItem } from "@/types";

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  governorate: string;
  postalCode: string;
  notes: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  shippingInfo: ShippingInfo | null;
  shippingFee: number;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
  shippingInfo: null,
  shippingFee: 250, // Default 250 EGP
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        (i) =>
          i.productId === action.payload.productId &&
          i.size === action.payload.size &&
          i.color === action.payload.color
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeItem: (
      state,
      action: PayloadAction<{ productId: string; size: string; color: string }>
    ) => {
      state.items = state.items.filter(
        (i) =>
          !(
            i.productId === action.payload.productId &&
            i.size === action.payload.size &&
            i.color === action.payload.color
          )
      );
    },
    updateQuantity: (
      state,
      action: PayloadAction<{
        productId: string;
        size: string;
        color: string;
        quantity: number;
      }>
    ) => {
      const item = state.items.find(
        (i) =>
          i.productId === action.payload.productId &&
          i.size === action.payload.size &&
          i.color === action.payload.color
      );
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    setShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
      state.shippingInfo = action.payload;
    },
    setShippingFee: (state, action: PayloadAction<number>) => {
      state.shippingFee = action.payload;
    },
    clearShippingInfo: (state) => {
      state.shippingInfo = null;
    },
  },
  selectors: {
    selectCartTotal: (state) =>
      state.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    selectCartCount: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity, 0),
    selectTotalAmount: (state) =>
      state.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
  },
});

export const {
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  setCartItems,
  toggleCart,
  setShippingInfo,
  setShippingFee,
  clearShippingInfo,
} = cartSlice.actions;

export const { selectCartTotal, selectCartCount, selectTotalAmount } = cartSlice.selectors;

export default cartSlice.reducer;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectShippingInfo = (state: { cart: CartState }) => state.cart.shippingInfo;
export const selectShippingFee = (state: { cart: CartState }) => state.cart.shippingFee;
