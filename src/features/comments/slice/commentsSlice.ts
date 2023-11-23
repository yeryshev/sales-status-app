import { createSlice } from '@reduxjs/toolkit';
import { CommentsState } from '../types';
import {
  addComment,
  deleteComment,
  setAllComments,
  setMyComments,
} from '../actions/commentsActions';

const initialState: CommentsState = {
  list: [],
  fullList: [],
  loading: false,
  error: null,
};

export const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setAllComments.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(setAllComments.fulfilled, (state, action) => {
        state.fullList = action.payload;
        state.loading = false;
      })
      .addCase(setAllComments.rejected, (state, action) => {
        state.error = action.error.message || 'Error';
        state.loading = false;
      })
      .addCase(setMyComments.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(setMyComments.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(setMyComments.rejected, (state, action) => {
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
          state.list = state.list.filter((comment) => comment.id !== action.payload);
          state.fullList = state.fullList.filter((comment) => comment.id !== action.payload);
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
