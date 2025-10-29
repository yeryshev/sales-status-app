import { StateSchema } from '@/app/providers/StoreProvider/config/StateSchema';

export const getStatusAnalyticsState = (state: StateSchema) => state.statusAnalytics;

export const getStatusHistory = (state: StateSchema) => state.statusAnalytics.history;
export const getStatusAnalytics = (state: StateSchema) => state.statusAnalytics.analytics;
export const getUsersForAnalytics = (state: StateSchema) => state.statusAnalytics.users;
export const getStatusesForAnalytics = (state: StateSchema) => state.statusAnalytics.statuses;

export const getStatusAnalyticsLoading = (state: StateSchema) => state.statusAnalytics.loading;
export const getStatusAnalyticsError = (state: StateSchema) => state.statusAnalytics.error;
export const getStatusAnalyticsFilters = (state: StateSchema) => state.statusAnalytics.filters;
export const getStatusAnalyticsDateRange = (state: StateSchema) => state.statusAnalytics.dateRange;

// Селекторы для вычисляемых данных
export const getTotalUsersInAnalytics = (state: StateSchema) => {
  const analytics = state.statusAnalytics.analytics;
  return new Set(analytics.map((item: { userId: number }) => item.userId)).size;
};

export const getTotalStatusesInAnalytics = (state: StateSchema) => {
  const analytics = state.statusAnalytics.analytics;
  return new Set(analytics.map((item: { statusId: number }) => item.statusId)).size;
};

export const getAnalyticsByUser = (state: StateSchema, userId: number) => {
  return state.statusAnalytics.analytics.filter((item: { userId: number }) => item.userId === userId);
};

export const getAnalyticsByStatus = (state: StateSchema, statusId: number) => {
  return state.statusAnalytics.analytics.filter((item: { statusId: number }) => item.statusId === statusId);
};

export const getTotalDurationInHours = (state: StateSchema) => {
  return state.statusAnalytics.analytics.reduce(
    (total: number, item: { totalDurationHours: number }) => total + item.totalDurationHours,
    0,
  );
};
