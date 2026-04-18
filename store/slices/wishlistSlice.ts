import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
  productIds: string[];
}

const initialState: WishlistState = {
  productIds: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlistItem: (state, action: PayloadAction<string>) => {
      const idx = state.productIds.indexOf(action.payload);
      if (idx > -1) {
        state.productIds.splice(idx, 1);
      } else {
        state.productIds.push(action.payload);
      }
    },
    setWishlist: (state, action: PayloadAction<string[]>) => {
      state.productIds = action.payload;
    },
    clearWishlist: (state) => {
      state.productIds = [];
    },
  },
});

export const { toggleWishlistItem, setWishlist, clearWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;

export const selectWishlistIds = (state: { wishlist: WishlistState }) =>
  state.wishlist.productIds;
export const selectIsWishlisted = (state: { wishlist: WishlistState }, productId: string) =>
  state.wishlist.productIds.includes(productId);
