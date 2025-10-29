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

export interface StatusAnalyticsRequest {
  userId?: number;
  startDate: string;
  endDate: string;
  statusId?: number;
  periodType: 'day' | 'week' | 'month';
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
    periodType: 'day' | 'week' | 'month';
  };
}
