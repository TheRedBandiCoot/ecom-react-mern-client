import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  AllProductsResponse,
  CategoriesResponse,
  DeleteProductRequest,
  MessageResponse,
  NewProductRequest,
  ProductDetailResponse,
  SearchProductsRequest,
  SearchProductsResponse,
  UpdateProductRequest
} from '../../types/api-types';
import axios from 'axios';

export const productAPI = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    //@ route - POST - /api/v1/product/
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/product/`
  }),
  tagTypes: ['product', 'allProducts'],
  // refetchOnFocus: true,

  endpoints: builder => ({
    latestProduct: builder.query<AllProductsResponse, string>({
      query: () => 'latest',
      providesTags: ['product', 'allProducts']
    }),
    allProducts: builder.query<AllProductsResponse, string>({
      query: id => `admin-products?id=${id}`,
      providesTags: ['product', 'allProducts']
    }),
    categories: builder.query<CategoriesResponse, string>({
      query: () => 'categories',
      providesTags: ['product', 'allProducts']
    }),
    searchProducts: builder.query<
      SearchProductsResponse,
      SearchProductsRequest
    >({
      query: ({ search, category, price, page, sort }) => {
        let base = `all?search=${search}&page=${page}`;
        if (price) base += `&price=${price}`;
        if (category) base += `&category=${category}`;
        if (sort) base += `&sort=${sort}`;
        return base;
      },
      providesTags: ['product', 'allProducts']
    }),
    productDetail: builder.query<ProductDetailResponse, string>({
      query: id => `${id}`,
      providesTags: ['product', 'allProducts']
    }),
    newProduct: builder.mutation<MessageResponse, NewProductRequest>({
      query: ({ id, formData }) => ({
        url: `new?id=${id}`,
        method: 'POST',
        body: formData
      }),
      invalidatesTags: ['product']
    }),
    updateProduct: builder.mutation<MessageResponse, UpdateProductRequest>({
      query: ({ userID, productID, formData }) => ({
        url: `${productID}?id=${userID}`,
        method: 'PUT',
        body: formData
      }),
      invalidatesTags: ['product']
    }),
    deleteProduct: builder.mutation<MessageResponse, DeleteProductRequest>({
      query: ({ userID, productID }) => ({
        url: `${productID}?id=${userID}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['allProducts']
    })
  })
});

export const {
  useLatestProductQuery,
  useAllProductsQuery,
  useCategoriesQuery,
  useSearchProductsQuery,
  useNewProductMutation,
  useProductDetailQuery,
  useUpdateProductMutation,
  useDeleteProductMutation
} = productAPI;

export const getProduct = async (id: string) => {
  try {
    const { data }: { data: AllProductsResponse } = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/v1/product/admin-products?id=${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};
