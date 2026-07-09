export interface StatusHistory {
  id: number;
  userId: number;
  userName?: string | null;
  oldStatusId: number | null;
  oldStatusTitle?: string | null;
  newStatusId: number;
  newStatusTitle?: string | null;
  startTime: string;
  endTime: string | null;
  durationSeconds: number | null;
  createdAt: string;
}

export type PeriodType =
  | 'today'
  | 'yesterday'
  | 'last30days'
  | 'currentWeek'
  | 'lastWeek'
  | 'currentMonth'
  | 'lastMonth'
  | 'allTime'
  | 'custom';

export interface StatusAnalyticsRequest {
  userId?: number;
  startDate: string;
  endDate: string;
  statusId?: number;
  periodType: PeriodType;
  departmentId?: 'managers' | 'account_managers' | 'customer_care';
}

export interface StatusAnalyticsResponse {
  userId: number;
  userName: string;
  statusId: number;
  statusTitle: string;
  startTime: string;
  endTime: string | null;
  totalDurationSeconds: number;
  totalDurationMinutes: number;
  totalDurationHours: number;
  percentage: number;
  periods: Array<{
    period: string;
    durationSeconds: number;
    durationMinutes: number;
    durationHours: number;
    changesCount: number;
  }>;
}

export interface UserForAnalytics {
  id: number;
  name: string;
  email: string;
  isManager: boolean;
  isAccountManager: boolean;
  isCcManager: boolean;
}

export interface StatusForAnalytics {
  id: number;
  title: string;
}

export interface DateRange {
  minDate: string | null;
  maxDate: string | null;
}

export interface StatusSummaryStatusItem {
  statusId: number;
  statusTitle: string;
  durationSeconds: number;
  durationHours: number;
  percentage: number;
}

export interface StatusSummaryUserItem {
  userId: number;
  userName: string;
  durationSeconds: number;
  durationHours: number;
  workDurationSeconds: number;
  workDurationHours: number;
  workPercentage: number;
}

export interface StatusSummaryDayStatusItem {
  statusId: number;
  statusTitle: string;
  durationSeconds: number;
  durationHours: number;
}

export interface StatusSummaryDayItem {
  date: string;
  totalDurationSeconds: number;
  userCount: number;
  statuses: StatusSummaryDayStatusItem[];
}

export interface StatusSummaryUserStatusItem {
  userId: number;
  userName: string;
  statuses: StatusSummaryDayStatusItem[];
}

export interface StatusAnalyticsSummary {
  totalDurationSeconds: number;
  totalDurationHours: number;
  workDurationSeconds: number;
  workDurationHours: number;
  workPercentage: number;
  offlineDurationSeconds: number;
  offlineDurationHours: number;
  uniqueUsers: number;
  uniqueStatuses: number;
  segmentCount: number;
  isAveraged: boolean;
  workingDaysCount: number;
  byStatus: StatusSummaryStatusItem[];
  byUser: StatusSummaryUserItem[];
  byDay: StatusSummaryDayItem[];
  byUserStatus: StatusSummaryUserStatusItem[];
}

export interface WorkloadCountersData {
  leads: number | null;
  overdueTasks: number | null;
  openConversations: number | null;
  assignedTickets: number | null;
}

export interface WorkloadUserAnalyticsItem {
  userId: number;
  userName: string;
  snapshotDays: number;
  averages: WorkloadCountersData;
  totals: WorkloadCountersData;
}

export interface WorkloadDayAnalyticsItem {
  date: string;
  userCount: number;
  averages: WorkloadCountersData;
  totals: WorkloadCountersData;
}

export interface WorkloadAnalyticsSummary {
  snapshotDays: number;
  uniqueUsers: number;
  averages: WorkloadCountersData;
  byUser: WorkloadUserAnalyticsItem[];
  byDay: WorkloadDayAnalyticsItem[];
}

export interface WorkloadAnalyticsRequest {
  startDate: string;
  endDate: string;
  userId?: number;
  departmentId?: 'managers' | 'account_managers' | 'customer_care';
}

export interface StatusAnalyticsState {
  history: StatusHistory[];
  analytics: StatusAnalyticsResponse[];
  summary: StatusAnalyticsSummary | null;
  workloadSummary: WorkloadAnalyticsSummary | null;
  workloadDateRange: DateRange | null;
  users: UserForAnalytics[];
  statuses: StatusForAnalytics[];
  dateRange: DateRange | null;
  loading: boolean;
  workloadLoading: boolean;
  error: string | null;
  workloadError: string | null;
  filters: {
    userId?: number;
    startDate: string;
    endDate: string;
    statusId?: number;
    periodType: PeriodType;
    departmentId?: 'managers' | 'account_managers' | 'customer_care';
  };
}
