import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  CouponDeleteRequest,
  CouponRequestBody,
  GetALLCouponsResponse,
  MessageResponse
} from '../../types/api-types';

export const couponAPI = createApi({
  reducerPath: 'couponApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/payment/coupon/`
  }),
  tagTypes: ['coupons'],
  endpoints: builder => ({
    createCoupon: builder.mutation<MessageResponse, CouponRequestBody>({
      query: ({ id, body }) => ({
        url: `new?id=${id}`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['coupons']
    }),

    deleteCoupon: builder.mutation<MessageResponse, CouponDeleteRequest>({
      query: ({ userId, couponId }) => ({
        url: `${couponId}?id=${userId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['coupons']
    }),

    getAllCoupons: builder.query<GetALLCouponsResponse, string>({
      query: id => `all?id=${id}`,
      providesTags: ['coupons']
    })
  })
});

export const {
  useCreateCouponMutation,
  useGetAllCouponsQuery,
  useDeleteCouponMutation
} = couponAPI;
