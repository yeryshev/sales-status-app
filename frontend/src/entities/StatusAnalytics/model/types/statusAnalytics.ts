export interface StatusHistory {
  id: number;
  userId: number;
  oldStatusId: number | null;
  newStatusId: number;
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

export interface StatusAnalyticsState {
  history: StatusHistory[];
  analytics: StatusAnalyticsResponse[];
  users: UserForAnalytics[];
  statuses: StatusForAnalytics[];
  dateRange: DateRange | null;
  loading: boolean;
  error: string | null;
  filters: {
    userId?: number;
    startDate: string;
    endDate: string;
    statusId?: number;
    periodType: PeriodType;
    departmentId?: 'managers' | 'account_managers' | 'customer_care';
  };
}
