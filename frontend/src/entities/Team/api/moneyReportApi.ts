import { rtkApi } from '@/shared/api/rtkApi';
import { MoneyReportResponse } from '../model/types/moneyReport';

const moneyReportApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getMoneyReport: build.query<MoneyReportResponse, boolean | void>({
      query: (isAccountManagersRoute = false) => {
        const baseUrl = import.meta.env.VITE_MONEY_REPORT_URL;
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

export const { useGetMoneyReportQuery } = moneyReportApi;
