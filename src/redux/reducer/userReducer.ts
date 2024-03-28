import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { UserReducerInitialState } from '../../types/reducer-types';
import { User } from '../../types/types';

const initialState: UserReducerInitialState = {
  user: null,
  loading: true,
  justLoggedIn: false
};

export const userReducer = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {
    userExist: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
    },
    userNotExist: state => {
      state.loading = false;
      state.user = null;
    },
    isLogin: state => {
      state.justLoggedIn = true;
    },
    isLogout: state => {
      state.justLoggedIn = false;
    }
  }
});

export const { userExist, userNotExist, isLogin, isLogout } =
  userReducer.actions;
