import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


// ✅ Safely load data from localStorage (client-side only)
export const loadCartFromLocalStorage = createAsyncThunk("cart/load", async () => {
  if (typeof window === "undefined") return { cartItems: {}, subtotal: 0, user: null };

  const saved = localStorage.getItem("cart");
  const savedUser = localStorage.getItem("myuser");
  const parsedUser = savedUser ? JSON.parse(savedUser) : null;

  // return all data as a single payload for Redux to update
  return {
    cartItems: saved ? JSON.parse(saved).cartItems || {} : {},
    subtotal: saved ? JSON.parse(saved).subtotal || 0 : 0,
    user: parsedUser ? { value: parsedUser.token, email: parsedUser.email, role: parsedUser.role } : { value: null, email: null, role: null },
    key: Math.random(), // new key on load (refresh)
  };
});

export const saveCartToLocalStorage = createAsyncThunk("cart/save", async (state) => {
  if (typeof window === "undefined") return false;

  try {
    localStorage.setItem(
      "cart",
      JSON.stringify({ cartItems: state.cartItems, subtotal: state.subtotal })
    );
    return true;
  } catch (error) {
    console.error("Error saving cart:", error);
    throw error;
  }
});

// ✅ Initial state
const initialState = {
  cartItems: {},
  subtotal: 0,
  user: { value: null },
  key: 0,
  status: "idle",
};

// ✅ Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { itemcode, name, desc, price, image, qty } = action.payload;
      if (!state.cartItems[itemcode]) {
        state.cartItems[itemcode] = { name, desc, price, image, qty };
      } else {
        state.cartItems[itemcode].qty += qty;
      }
      state.subtotal += price * qty;
    },
    removeFromCart: (state, action) => {
      const { itemcode } = action.payload;
      const item = state.cartItems[itemcode];
      if (item) {
        if (item.qty > 1) {
          item.qty -= 1;
          state.subtotal -= item.price;
        } else {
          state.subtotal -= item.price;
          delete state.cartItems[itemcode];
        }
      }
    },
    clearCart: (state) => {
      state.cartItems = {};
      state.subtotal = 0;
    },
    buyNow: (state, action) => {
      const { itemcode, name, desc, price, image, qty } = action.payload;
      state.cartItems = {};
      state.subtotal = 0;
      state.cartItems[itemcode] = { name, desc, price, image, qty };
      state.subtotal = price * qty;
    },
    // ✅ helper reducers for user and key
    setUser: (state, action) => {
      // state.user = { value: action.payload, email: action.payload };
      // localStorage.setItem("myuser", action.payload);
      const { token, email, role } = action.payload;
      state.user = { value: token, email: email, role: role };
      localStorage.setItem("myuser", JSON.stringify({ token, email, role }));
    },
    logoutUser: (state) => {
      state.user = { value: null, email: null };
      localStorage.removeItem("myuser");
    },
    regenerateKey: (state) => {
      state.key = Math.random();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveCartToLocalStorage.fulfilled, (state) => {
        state.status = "saved";
      })
      .addCase(loadCartFromLocalStorage.fulfilled, (state, action) => {
        // merge the loaded state safely
        state.cartItems = action.payload.cartItems;
        state.subtotal = action.payload.subtotal;
        state.user = action.payload.user;
        state.key = action.payload.key;
        state.status = "loaded"; 
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  buyNow,
  setUser,
  logoutUser,
  regenerateKey,
} = cartSlice.actions;

export default cartSlice.reducer;
