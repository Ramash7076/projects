import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "sidecart",
  initialState: {
    isSideCartOpen: false,
  },
  reducers: {
    openSideCart: (state) => {
      state.isSideCartOpen = true;
    },
    closeSideCart: (state) => {
      state.isSideCartOpen = false;
    },
    toggleSideCart: (state) => {
      state.isSideCartOpen = !state.isSideCartOpen;
    },
  },
});

export const { openSideCart, closeSideCart, toggleSideCart } = uiSlice.actions;
export default uiSlice.reducer;
