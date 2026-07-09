import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  StatusHistory,
  StatusAnalyticsRequest,
  StatusAnalyticsResponse,
  StatusAnalyticsSummary,
  WorkloadAnalyticsSummary,
  UserForAnalytics,
  StatusForAnalytics,
} from '../types/statusAnalytics';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Получение истории статусов
export const fetchStatusHistory = createAsyncThunk(
  'statusAnalytics/fetchStatusHistory',
  async (params: {
    userId?: number;
    startDate?: string;
    endDate?: string;
    limit?: number;
    departmentId?: 'managers' | 'account_managers' | 'customer_care';
  }) => {
    const searchParams = new URLSearchParams();
    if (params.userId) searchParams.append('user_id', params.userId.toString());
    if (params.startDate) searchParams.append('start_date', params.startDate);
    if (params.endDate) searchParams.append('end_date', params.endDate);
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.departmentId) searchParams.append('department_id', params.departmentId);

    const response = await fetch(`${API_BASE_URL}/admin/status-analytics/status-history?${searchParams}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Ошибка получения истории статусов');
    }

    return (await response.json()) as StatusHistory[];
  },
);

// Получение аналитики статусов
export const fetchStatusAnalytics = createAsyncThunk(
  'statusAnalytics/fetchStatusAnalytics',
  async (request: StatusAnalyticsRequest) => {
    const response = await fetch(`${API_BASE_URL}/admin/status-analytics/status-analytics`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Ошибка получения аналитики статусов');
    }

    return (await response.json()) as StatusAnalyticsResponse[];
  },
);

// Получение агрегированной сводки для дашборда
export const fetchStatusAnalyticsSummary = createAsyncThunk(
  'statusAnalytics/fetchStatusAnalyticsSummary',
  async (request: StatusAnalyticsRequest) => {
    const response = await fetch(`${API_BASE_URL}/admin/status-analytics/summary`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Ошибка получения сводки аналитики');
    }

    return (await response.json()) as StatusAnalyticsSummary;
  },
);

// Получение списка пользователей для фильтрации
export const fetchUsersForAnalytics = createAsyncThunk('statusAnalytics/fetchUsersForAnalytics', async () => {
  const response = await fetch(`${API_BASE_URL}/admin/status-analytics/users`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Ошибка получения списка пользователей');
  }

  return (await response.json()) as UserForAnalytics[];
});

// Получение списка статусов для фильтрации
export const fetchStatusesForAnalytics = createAsyncThunk('statusAnalytics/fetchStatusesForAnalytics', async () => {
  const response = await fetch(`${API_BASE_URL}/admin/status-analytics/statuses`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Ошибка получения списка статусов');
  }

  return (await response.json()) as StatusForAnalytics[];
});

// Получение диапазона дат из истории статусов
export const fetchDateRange = createAsyncThunk('statusAnalytics/fetchDateRange', async () => {
  const response = await fetch(`${API_BASE_URL}/admin/status-analytics/date-range`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Ошибка получения диапазона дат');
  }

  return (await response.json()) as { minDate: string | null; maxDate: string | null };
});

export const fetchWorkloadAnalyticsSummary = createAsyncThunk(
  'statusAnalytics/fetchWorkloadAnalyticsSummary',
  async (request: {
    startDate: string;
    endDate: string;
    userId?: number;
    departmentId?: 'managers' | 'account_managers' | 'customer_care';
  }) => {
    const response = await fetch(`${API_BASE_URL}/admin/workload-analytics/summary`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error('Ошибка получения аналитики нагрузки');
    }

    return (await response.json()) as WorkloadAnalyticsSummary;
  },
);

export const fetchWorkloadDateRange = createAsyncThunk('statusAnalytics/fetchWorkloadDateRange', async () => {
  const response = await fetch(`${API_BASE_URL}/admin/workload-analytics/date-range`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Ошибка получения диапазона дат нагрузки');
  }

  return (await response.json()) as { minDate: string | null; maxDate: string | null };
});
