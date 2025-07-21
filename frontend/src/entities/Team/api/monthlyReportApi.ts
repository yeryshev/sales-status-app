import { rtkApi } from '@/shared/api/rtkApi';
import { MonthlyReportResponse } from '../model/types/monthlyReport';

const monthlyReportApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getMonthlyReport: build.query<MonthlyReportResponse, void>({
      query: () => ({
        url: import.meta.env.VITE_MONTHLY_REPORT_URL,
        method: 'GET',
        credentials: 'same-origin',
      }),
    }),
  }),
});

export const { useGetMonthlyReportQuery } = monthlyReportApi;
