import { createSlice } from '@reduxjs/toolkit';
import { type CommentsSchema, fetchAllComments, fetchCommentsByUserId } from '@/entities/Comment';
import { addComment } from '@/features/AddCommentForm';
import { deleteComment } from '@/features/SelectCommentForm';

const initialState: CommentsSchema = {
    list: [],
    fullList: [],
    loading: false,
    error: null,
};

export const commentBoxSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllComments.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(fetchAllComments.fulfilled, (state, action) => {
                state.fullList = action.payload;
                state.loading = false;
            })
            .addCase(fetchAllComments.rejected, (state, action) => {
                state.error = action.error.message || 'Error';
                state.loading = false;
            })
            .addCase(fetchCommentsByUserId.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(fetchCommentsByUserId.fulfilled, (state, action) => {
                state.list = action.payload;
                state.loading = false;
            })
            .addCase(fetchCommentsByUserId.rejected, (state, action) => {
                state.error = action.error.message || 'Error';
                state.loading = false;
            })
            .addCase(addComment.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                if (action.payload) {
                    state.list.push(action.payload);
                    state.fullList.push(action.payload);
                    state.loading = false;
                }
            })
            .addCase(addComment.rejected, (state, action) => {
                state.error = action.error.message || 'Error';
                state.loading = false;
            })
            .addCase(deleteComment.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                if (action.payload) {
                    state.list = state.list.filter((comment) => comment.id !== action.payload.id);
                    state.fullList = state.fullList.filter(
                        (comment) => comment.id !== action.payload.id,
                    );
                    state.loading = false;
                }
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.error = action.error.message || 'Error';
                state.loading = false;
            });
    },
});

export const { reducer: commentsReducer } = commentBoxSlice;
