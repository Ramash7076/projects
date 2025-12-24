"use client";
import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "../store";
import { saveCartToLocalStorage, loadCartFromLocalStorage, setUser, logoutUser, } from "@/redux/cart/cartSlice";


function CartSync() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  // Load from localStorage when app starts
  useEffect(() => {
    dispatch(loadCartFromLocalStorage());


  }, [dispatch]);
 
  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (cart.status !== "idle") {
      dispatch(saveCartToLocalStorage({ cartItems: cart.cartItems, subtotal: cart.subtotal }));
    }
  }, [cart.cartItems, cart.subtotal, dispatch]);

  return null;
}

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <CartSync />
      {children}
    </Provider>
  );
}
