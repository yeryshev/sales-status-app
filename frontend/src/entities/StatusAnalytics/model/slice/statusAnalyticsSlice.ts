import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchStatusHistory,
  fetchStatusAnalytics,
  fetchUsersForAnalytics,
  fetchStatusesForAnalytics,
  fetchDateRange,
} from '../api/statusAnalyticsApi';
import { StatusAnalyticsState } from '../types/statusAnalytics';

const initialState: StatusAnalyticsState = {
  history: [],
  analytics: [],
  users: [],
  statuses: [],
  dateRange: null,
  loading: false,
  error: null,
  filters: {
    startDate: (() => {
      // Получаем текущую дату в Московском времени
      const now = new Date();
      const moscowTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
      return moscowTime.toISOString().split('T')[0];
    })(),
    endDate: (() => {
      // Получаем текущую дату в Московском времени
      const now = new Date();
      const moscowTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));
      return moscowTime.toISOString().split('T')[0];
    })(),
    periodType: 'today',
  },
};

const statusAnalyticsSlice = createSlice({
  name: 'statusAnalytics',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<StatusAnalyticsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearData: (state) => {
      state.history = [];
      state.analytics = [];
    },
  },
  extraReducers: (builder) => {
    // История статусов
    builder
      .addCase(fetchStatusHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatusHistory.fulfilled, (state, action) => {
        state.history = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchStatusHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка получения истории статусов';
      });

    // Аналитика статусов
    builder
      .addCase(fetchStatusAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatusAnalytics.fulfilled, (state, action) => {
        state.analytics = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchStatusAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка получения аналитики статусов';
      });

    // Пользователи для фильтрации
    builder
      .addCase(fetchUsersForAnalytics.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUsersForAnalytics.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(fetchUsersForAnalytics.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка получения списка пользователей';
      });

    // Статусы для фильтрации
    builder
      .addCase(fetchStatusesForAnalytics.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchStatusesForAnalytics.fulfilled, (state, action) => {
        state.statuses = action.payload;
      })
      .addCase(fetchStatusesForAnalytics.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка получения списка статусов';
      });

    // Диапазон дат
    builder
      .addCase(fetchDateRange.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchDateRange.fulfilled, (state, action) => {
        state.dateRange = action.payload;
      })
      .addCase(fetchDateRange.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка получения диапазона дат';
      });
  },
});

export const { setFilters, clearError, clearData } = statusAnalyticsSlice.actions;
export default statusAnalyticsSlice.reducer;
