import { rtkApi } from '@/shared/api/rtkApi';
import { Status } from '../model/types/Status';

const statusApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getStatuses: build.query<Status[], void>({
      query: () => ({
        url: import.meta.env.VITE_BACKEND_URL + '/status',
      }),
    }),
  }),
});

export const useGetStatuses = statusApi.useGetStatusesQuery;
