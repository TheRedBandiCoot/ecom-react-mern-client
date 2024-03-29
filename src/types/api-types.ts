import {
  Bar,
  CartItem,
  Line,
  Order,
  Pie,
  Product,
  ShippingInfo,
  Stats,
  User
} from './types';

export type MessageResponse = {
  success: boolean;
  message: string;
};
export type CouponOnErrorResponse = {
  success: boolean;
  message: string;
};

export type UserResponse = {
  success: boolean;
  user: User;
};

export type AllUserResponse = {
  success: boolean;
  users: User[];
};

export type DeleteUserRequest = {
  userId: string;
  AdminUserId: string;
};

export type CouponResponse = {
  success: boolean;
  discount: number;
};

export type AllProductsResponse = {
  success: boolean;
  products: Product[];
};

export type CategoriesResponse = {
  success: boolean;
  categories: string[];
};

export type SearchProductsResponse = AllProductsResponse & {
  totalPage: number;
};
export type SearchProductsRequest = {
  search: string;
  sort: string;
  category: string;
  price: number;
  page: number;
};

export type NewProductRequest = {
  id: string;
  formData: FormData;
};
export type UpdateProductRequest = {
  userID: string;
  productID: string;
  formData: FormData;
};
export type NewOrderRequest = {
  shippingInfo: ShippingInfo;
  user: string;
  orderItems: CartItem[];
  subTotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
};

export type DeleteProductRequest = {
  userID: string;
  productID: string;
};

export type ProductDetailResponse = {
  success: boolean;
  product: Product;
};
export type AllOrdersResponse = {
  success: boolean;
  orders: Order[];
};
export type OrderDetailsResponse = {
  success: boolean;
  order: Order;
};

export type UpdateOrDeleteOrderRequest = {
  userId: string;
  orderId: string;
};

export type StatsResponse = {
  success: boolean;
  stats: Stats;
};
export type PieResponse = {
  success: boolean;
  charts: Pie;
};
export type BarResponse = {
  success: boolean;
  charts: Bar;
};
export type LineResponse = {
  success: boolean;
  charts: Line;
};

export type CouponRequestBody = {
  id: string;
  body: {
    coupon: string;
    amount: number;
  };
};

type CouponType = {
  _id: string;
  code: string;
  amount: number;
};

export type GetALLCouponsResponse = {
  success: boolean;
  coupons: CouponType[];
};

export type CouponDeleteRequest = {
  userId: string;
  couponId: string;
};
