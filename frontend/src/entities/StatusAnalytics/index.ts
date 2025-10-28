export { RequireSuperuser } from '@/shared/lib/components/RequireSuperuser';

export { default as statusAnalyticsReducer } from './model/slice/statusAnalyticsSlice';
export {
  fetchStatusHistory,
  fetchStatusAnalytics,
  fetchUsersForAnalytics,
  fetchStatusesForAnalytics,
} from './model/api/statusAnalyticsApi';
export { setFilters, clearError, clearData } from './model/slice/statusAnalyticsSlice';
export {
  getStatusAnalyticsState,
  getStatusHistory,
  getStatusAnalytics,
  getUsersForAnalytics,
  getStatusesForAnalytics,
  getStatusAnalyticsLoading,
  getStatusAnalyticsError,
  getStatusAnalyticsFilters,
  getTotalUsersInAnalytics,
  getTotalStatusesInAnalytics,
  getAnalyticsByUser,
  getAnalyticsByStatus,
  getTotalDurationInHours,
} from './model/selectors/statusAnalyticsSelectors';

export type {
  StatusHistory,
  StatusAnalyticsRequest,
  StatusAnalyticsResponse,
  UserForAnalytics,
  StatusForAnalytics,
  StatusAnalyticsState,
} from './model/types/statusAnalytics';
