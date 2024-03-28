export type User = {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: 'user' | 'admin';
  gender: 'male' | 'female';
  dob: string;
  createdAt?: Date | string;
};

export type Product = {
  _id: string;
  name: string;
  photo: string;
  price: number;
  stock: number;
  category: string;
};

export type CustomError = {
  status: number;
  data: {
    message: string;
    success: boolean;
  };
};

export type ShippingInfo = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
};
export type CartItem = {
  productID: string;
  photo: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
};

export type OrderItem = Omit<CartItem, 'stock'> & { _id: string };

export type Order = {
  shippingInfo: ShippingInfo;
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  subTotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  orderItems: OrderItem[];
};

type CountAndChangePercentType = {
  revenue: number;
  product: number;
  user: number;
  order: number;
};

type LatestTransaction = {
  _id: string;
  amount: number;
  discount: number;
  quantity: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
};

export type Stats = {
  categoryCount: Record<string, number>[];
  userGenderRatio: {
    male: number;
    female: number;
  };
  changePercent: CountAndChangePercentType;
  count: CountAndChangePercentType;
  latestTransaction: LatestTransaction[];
  chart: {
    order: number[];
    revenue: number[];
  };
};

export type refetchProductAction = {
  isProductRefetch?: boolean;
  isStatsRefetch?: boolean;
  isTransactionRefetch?: boolean;
};
type RevenueDistribution = {
  netMargin: number;
  discount: number;
  productionCost: number;
  burnt: number;
  marketingCost: number;
};

type OrderFullfillment = {
  processing: number;
  shipped: number;
  delivered: number;
};
export type Pie = {
  productCategories: Record<string, number>[];
  orderFullfillment: OrderFullfillment;
  stockAvailability: {
    inStock: number;
    outOfStock: number;
  };
  revenueDistribution: RevenueDistribution;
  usersAgeGroup: {
    teen: number;
    adult: number;
    old: number;
  };
  adminCustomer: {
    admin: number;
    customer: number;
  };
};

export type Bar = {
  products: number[];
  users: number[];
  orders: number[];
};

export type Line = {
  products: number[];
  users: number[];
  revenue: number[];
  discount: number[];
};
