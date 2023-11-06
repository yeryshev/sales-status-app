import { createSlice } from '@reduxjs/toolkit';
import { CommentsState } from '../types';
import { addComment, deleteComment, setComments } from '../actions/commentsActions';

const initialState: CommentsState = {
  list: [],
  loading: false,
  error: null,
};

export const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setComments.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(setComments.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(setComments.rejected, (state, action) => {
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
          state.list = state.list.filter((comment) => comment.id !== action.payload);
          state.loading = false;
        }
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.error = action.error.message || 'Error';
        state.loading = false;
      });
  },
});

export default commentsSlice.reducer;
