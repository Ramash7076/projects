
import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cart/cartSlice'
import uiReducer from './sidecart/uiSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    sidecart: uiReducer,
  },
}) 