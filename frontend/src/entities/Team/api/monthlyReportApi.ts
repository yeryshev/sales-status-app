import { rtkApi } from '@/shared/api/rtkApi';
import { MonthlyReportResponse } from '../model/types/monthlyReport';

const monthlyReportApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getMonthlyReport: build.query<MonthlyReportResponse, boolean | void>({
      query: (isAccountManagersRoute = false) => {
        const baseUrl = import.meta.env.VITE_MONTHLY_REPORT_URL;
        const url = isAccountManagersRoute ? `${baseUrl}/account` : baseUrl;

        return {
          url,
          method: 'GET',
          credentials: 'same-origin',
        };
      },
    }),
  }),
});

export const { useGetMonthlyReportQuery } = monthlyReportApi;
