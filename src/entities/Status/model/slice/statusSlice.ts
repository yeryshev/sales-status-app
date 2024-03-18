import { createSlice } from '@reduxjs/toolkit';
import { StatusSchema } from '../..';

const initialState: StatusSchema = {
    value: null,
    loading: false,
    error: null
};

export const statusSlice = createSlice({
    name: 'status',
    initialState,
    reducers: {
        changeStatus: (state, action) => {
            if (state.value === action.payload) return;
            if (action.payload < 1 || action.payload > 3) return;
            state.value = action.payload;
        }
    }
});

export const { actions: statusActions } = statusSlice;
export const { reducer: statusReducer } = statusSlice;
