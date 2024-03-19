import { checkUser, clearUser, updateUser } from '../actions/userActions';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserSchema } from '../types/User';

const userInitialState: UserSchema = {
    loading: false,
    error: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState: userInitialState,
    reducers: {
        setAuthData: (state, action: PayloadAction<User>) => void (state.user = action.payload),
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkUser.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(checkUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.authData = action.payload;
                state.error = null;
                state.loading = false;
            })
            .addCase(checkUser.rejected, (state, action) => {
                state.user = undefined;
                state.error = action.error.message || 'Error';
                state.loading = false;
            })
            .addCase(clearUser.pending, (state) => {
                state.user = undefined;
                state.authData = undefined;
            })
            .addCase(clearUser.fulfilled, (state) => {
                state.user = undefined;
                state.authData = undefined;
            })
            .addCase(clearUser.rejected, (state, action) => {
                state.user = undefined;
                state.authData = undefined;
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

export const { actions: userActions } = userSlice;
export const { reducer: userReducer } = userSlice;
