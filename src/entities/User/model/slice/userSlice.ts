import { checkUser, clearUser, updateUser } from '../actions/userActions';
import { createSlice } from '@reduxjs/toolkit';
import { type UserState } from '../types/UserState';

const userInitialState: UserState = {
    user: null,
    loading: false,
    error: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState: userInitialState,
    reducers: {
        setUser: (state, action) => void (state.user = action.payload),
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkUser.pending, (state) => {
                state.error = null;
            })
            .addCase(checkUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.error = null;
            })
            .addCase(checkUser.rejected, (state, action) => {
                state.user = null;
                state.error = action.error.message || 'Error';
            })
            .addCase(clearUser.pending, (state) => {
                state.user = null;
            })
            .addCase(clearUser.fulfilled, (state) => {
                state.user = null;
            })
            .addCase(clearUser.rejected, (state, action) => {
                state.user = null;
                state.error = action.error.message || 'Error';
            })
            .addCase(updateUser.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                if (action.payload) {
                    state.user = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.error = action.error.message || 'Error';
                state.loading = false;
            });
    },
});

export const { setUser } = userSlice.actions;
export const { reducer: userReducer } = userSlice;
