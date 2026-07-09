export { RequireSuperuser } from '@/shared/lib/components/RequireSuperuser';

export { default as statusAnalyticsReducer } from './model/slice/statusAnalyticsSlice';
export {
  fetchStatusHistory,
  fetchStatusAnalytics,
  fetchStatusAnalyticsSummary,
  fetchUsersForAnalytics,
  fetchStatusesForAnalytics,
  fetchDateRange,
  fetchWorkloadAnalyticsSummary,
  fetchWorkloadDateRange,
} from './model/api/statusAnalyticsApi';
export { setFilters, clearError, clearData, clearWorkloadError } from './model/slice/statusAnalyticsSlice';
export {
  getStatusAnalyticsState,
  getStatusHistory,
  getStatusAnalytics,
  getStatusAnalyticsSummary,
  getWorkloadAnalyticsSummary,
  getWorkloadAnalyticsLoading,
  getWorkloadAnalyticsError,
  getWorkloadAnalyticsDateRange,
  getUsersForAnalytics,
  getStatusesForAnalytics,
  getStatusAnalyticsLoading,
  getStatusAnalyticsError,
  getStatusAnalyticsFilters,
  getStatusAnalyticsDateRange,
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
  DateRange,
  StatusAnalyticsState,
  StatusAnalyticsSummary,
  WorkloadAnalyticsSummary,
  WorkloadAnalyticsRequest,
  WorkloadCountersData,
  PeriodType,
} from './model/types/statusAnalytics';

export {
  WORKLOAD_METRICS,
  formatWorkloadValue,
  getWorkloadMetricValue,
  type WorkloadMetricKey,
} from './lib/workloadMetrics';

export {
  calculatePeriodDates,
  isSingleDayPeriod,
  getPeriodLabel,
  subtractDaysFromDateString,
} from './lib/calculatePeriodDates';
export {
  formatDurationFromSeconds,
  formatDurationFromHours,
  formatDateTimeMoscow,
  formatShortDate,
} from './lib/formatDuration';
export {
  getStatusChartColor,
  getStatusChipColor,
  getStatusChipColorByTitle,
  isOfflineStatus,
  OFFLINE_STATUS_ID,
} from './lib/statusColors';
