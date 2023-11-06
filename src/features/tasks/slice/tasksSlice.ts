import { createSlice } from '@reduxjs/toolkit';
import { addTask, deleteTask, setTasks } from '../actions/tasksActions';
import { TasksState } from '../types';

const initialState: TasksState = {
  list: [],
  loading: false,
  error: null,
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    removeTask: (state, action) => {
      state.list = state.list.filter((task) => task.uuid !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setTasks.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(setTasks.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(setTasks.rejected, (state, action) => {
        state.error = action.error.message || 'Error';
        state.loading = false;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        if (action.payload) {
          state.list.push(action.payload);
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        if (action.payload) {
          state.list = state.list.filter((task) => task.uuid !== action.payload);
        }
      });
  },
});

export const { removeTask } = tasksSlice.actions;

export default tasksSlice.reducer;
