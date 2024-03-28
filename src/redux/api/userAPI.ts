import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  AllUserResponse,
  DeleteUserRequest,
  MessageResponse,
  UserResponse
} from '../../types/api-types';
import { User } from '../../types/types';
import axios from 'axios';

export const userAPI = createApi({
  reducerPath: 'useApi',
  baseQuery: fetchBaseQuery({
    //@ route - POST - /api/v1/user/new
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user/`
  }),
  tagTypes: ['users'],
  // refetchOnFocus: true,
  endpoints: builder => ({
    login: builder.mutation<MessageResponse, User>({
      query: userData => ({
        url: 'new',
        method: 'POST',
        body: userData
      }),
      invalidatesTags: ['users']
    }),

    deleteUsers: builder.mutation<MessageResponse, DeleteUserRequest>({
      query: ({ userId, AdminUserId }) => ({
        url: `${userId}?id=${AdminUserId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['users']
    }),

    allUsers: builder.query<AllUserResponse, string>({
      query: id => `all?id=${id}`,
      providesTags: ['users']
    }),

    getSingleUser: builder.query<UserResponse, string>({
      query: id => id,
      providesTags: ['users']
    })
  })
});

export const getUser = async (id: string) => {
  try {
    const { data }: { data: UserResponse } = await axios.get(
      `${import.meta.env.VITE_SERVER}/api/v1/user/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

export const {
  useLoginMutation,
  useAllUsersQuery,
  useDeleteUsersMutation,
  useGetSingleUserQuery
} = userAPI;
