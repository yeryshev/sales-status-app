import { rtkApi } from '@/shared/api/rtkApi';
import { MoneyReportResponse } from '../model/types/moneyReport';

const moneyReportApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getMoneyReport: build.query<MoneyReportResponse, void>({
      query: () => ({
        url: import.meta.env.VITE_MONEY_REPORT_URL,
        method: 'GET',
        credentials: 'same-origin',
      }),
    }),
  }),
});

export const { useGetMoneyReportQuery } = moneyReportApi;
