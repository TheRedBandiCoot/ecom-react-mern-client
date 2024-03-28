import type { CartItem, ShippingInfo, User } from './types';

export interface UserReducerInitialState {
  user: User | null;
  loading: boolean;
  justLoggedIn?: boolean;
}
export interface ModalReducerInitialState {
  value: boolean;
  unmounted: boolean;
  id?: string;
  name?: string;
}

export interface CartReducerInitialState {
  loading: boolean;
  cartItems: CartItem[];
  subTotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  shippingInfo: ShippingInfo;
  isProductRefetch?: boolean;
  isStatsRefetch?: boolean;
  isTransactionRefetch?: boolean;
}
