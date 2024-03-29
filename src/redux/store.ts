import { configureStore } from '@reduxjs/toolkit';
import { productAPI } from './api/productAPI';
import { userAPI } from './api/userAPI';
import { userReducer } from './reducer/userReducer';
import { modalReducer } from './reducer/modalReducer';
import { cartReducer } from './reducer/cartReducer';
// import { setupListeners } from '@reduxjs/toolkit/query';
import { orderAPI } from './api/orderAPI';
import { dashboardAPI } from './api/dashboardAPI';
import { couponAPI } from './api/couponAPI';

export const server = import.meta.env.VITE_SERVER;
export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [productAPI.reducerPath]: productAPI.reducer,
    [orderAPI.reducerPath]: orderAPI.reducer,
    [dashboardAPI.reducerPath]: dashboardAPI.reducer,
    [couponAPI.reducerPath]: couponAPI.reducer,
    [userReducer.name]: userReducer.reducer,
    [modalReducer.name]: modalReducer.reducer,
    [cartReducer.name]: cartReducer.reducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      userAPI.middleware,
      productAPI.middleware,
      orderAPI.middleware,
      dashboardAPI.middleware,
      couponAPI.middleware
    )
});

// setupListeners(store.dispatch);
// console.log(store.getState()['cartReducer']);

export type RootState = ReturnType<typeof store.getState>;
