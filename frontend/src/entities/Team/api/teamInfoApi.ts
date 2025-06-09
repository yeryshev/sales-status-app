import { rtkApi } from '@/shared/api/rtkApi';
import { AdditionalUserData } from '../model/types/teamNewWebsocket';

const n8nApiUrl = import.meta.env.VITE_NEW_API_URL;
const apiWsUrl = import.meta.env.VITE_API_URL + '/ws/state';

const tasksApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getAdditionalTeamData: build.query<Array<AdditionalUserData>, void>({
      query: () => ({
        url: n8nApiUrl,
        credentials: 'same-origin',
      }),
      async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        let ws: WebSocket | null = null;
        try {
          await cacheDataLoaded;
          ws = new WebSocket(apiWsUrl);

          const listener = (event: MessageEvent) => {
            const dataFromSocket: AdditionalUserData = JSON.parse(event.data);

            updateCachedData((draft: Array<AdditionalUserData>) => {
              const index = draft.findIndex((item) => item.idInside === dataFromSocket.idInside);
              if (index !== -1) {
                draft[index] = dataFromSocket;
              }
            });
          };

          ws.addEventListener('message', listener);
          ws.addEventListener('error', (event) => {
            console.error('WebSocket error:', event);
          });
        } catch (error) {
          console.error('Error occurred:', error);
        } finally {
          await cacheEntryRemoved;
          if (ws && ws.readyState === WebSocket.OPEN) {
            ws.close();
          }
        }
      },
    }),
  }),
});

export const useGetAdditionalTeamData = tasksApi.useGetAdditionalTeamDataQuery;
