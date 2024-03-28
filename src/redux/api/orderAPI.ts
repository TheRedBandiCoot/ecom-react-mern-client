import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  AllOrdersResponse,
  MessageResponse,
  NewOrderRequest,
  OrderDetailsResponse,
  UpdateOrDeleteOrderRequest
} from '../../types/api-types';

export const orderAPI = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    //@ route - POST - /api/v1/order/
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/order/`
  }),
  tagTypes: ['orders'],
  endpoints: builder => ({
    createOrder: builder.mutation<MessageResponse, NewOrderRequest>({
      query: orderData => ({ url: `new`, method: 'POST', body: orderData }),
      invalidatesTags: ['orders']
    }),

    updateOrder: builder.mutation<MessageResponse, UpdateOrDeleteOrderRequest>({
      query: ({ userId, orderId }) => ({
        url: `${orderId}?id=${userId}`,
        method: 'PUT'
      }),
      invalidatesTags: ['orders']
    }),

    deleteOrder: builder.mutation<MessageResponse, UpdateOrDeleteOrderRequest>({
      query: ({ userId, orderId }) => ({
        url: `${orderId}?id=${userId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['orders']
    }),

    myOrder: builder.query<AllOrdersResponse, string>({
      query: id => `my?id=${id}`,
      providesTags: ['orders']
    }),

    allOrder: builder.query<AllOrdersResponse, string>({
      query: id => `all?id=${id}`,
      providesTags: ['orders']
    }),

    orderDetails: builder.query<OrderDetailsResponse, string>({
      query: id => id,
      providesTags: ['orders']
    })
  })
});

export const {
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useMyOrderQuery,
  useAllOrderQuery,
  useOrderDetailsQuery
} = orderAPI;
