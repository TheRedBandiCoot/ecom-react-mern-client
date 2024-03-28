import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { CartReducerInitialState } from '../../types/reducer-types';
import {
  CartItem,
  ShippingInfo,
  refetchProductAction
} from '../../types/types';

const initialState: CartReducerInitialState = {
  loading: false,
  cartItems: [],
  subTotal: 0,
  tax: 0,
  shippingCharges: 0,
  discount: 0,
  total: 0,
  shippingInfo: {
    address: '',
    city: '',
    country: '',
    state: '',
    pinCode: ''
  },
  isProductRefetch: false,
  isStatsRefetch: false,
  isTransactionRefetch: false
};

export const cartReducer = createSlice({
  name: 'cartReducer',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.loading = true;
      const index = state.cartItems.findIndex(
        i => i.productID === action.payload.productID
      );
      if (index !== -1) state.cartItems[index] = action.payload;
      else state.cartItems.push(action.payload);
      state.loading = false;
    },
    removeCartItem: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.cartItems = state.cartItems.filter(
        i => i.productID !== action.payload
      );
      state.loading = false;
    },
    calculatePrice: state => {
      const subTotal = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      state.subTotal = subTotal;
      state.shippingCharges =
        state.cartItems.length < 1 || state.subTotal > 1000 ? 0 : 200;
      state.tax = Math.round(state.subTotal * 0.18);
      state.total =
        state.subTotal + state.shippingCharges + state.tax - state.discount;
    },
    discountApplied: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;
    },
    saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
      state.shippingInfo = action.payload;
    },
    resetCart: () => initialState,
    refetchProduct: (state, action: PayloadAction<refetchProductAction>) => {
      state.isProductRefetch = action.payload.isProductRefetch;
      state.isStatsRefetch = action.payload.isStatsRefetch;
    },
    refetchOrder: (state, action: PayloadAction<refetchProductAction>) => {
      state.isTransactionRefetch = action.payload.isTransactionRefetch;
    }
  }
});

export const {
  addToCart,
  removeCartItem,
  calculatePrice,
  discountApplied,
  saveShippingInfo,
  resetCart,
  refetchProduct,
  refetchOrder
} = cartReducer.actions;
