import { rtkApi } from '@/shared/api/rtkApi';
import { Status } from '../model/types/Status';

const statusApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getStatuses: build.query<Status[], void>({
      query: () => ({
        url: '/status', // RTK Query автоматически добавит базовый URL
      }),
    }),
  }),
});

export const useGetStatuses = statusApi.useGetStatusesQuery;
