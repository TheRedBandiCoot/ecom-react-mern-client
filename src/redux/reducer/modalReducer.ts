import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ModalReducerInitialState } from '../../types/reducer-types';

const initialState: ModalReducerInitialState = {
  value: false,
  unmounted: false,
  id: '',
  name: ''
};

export const modalReducer = createSlice({
  name: 'modalReducer',
  initialState,
  reducers: {
    openBtn: (
      state,
      action: PayloadAction<{ id: string; name?: string } | undefined>
    ) => {
      state.value = true;
      state.unmounted = false;
      state.id = action?.payload?.id;
      state.name = action?.payload?.name;
    },
    closeBtn: state => {
      state.unmounted = true;
    },
    closeBtnValue: state => {
      state.value = false;
    }
  }
});

export const { openBtn, closeBtn, closeBtnValue } = modalReducer.actions;
