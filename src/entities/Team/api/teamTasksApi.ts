import { rtkApi } from '@/shared/api/rtkApi';
import { TasksData, WsTasksData, WsTypes } from '../model/types/tasksWebsocket';

const inboundUrl = import.meta.env.VITE_API_URL + '/state';
const inboundWsUrl = import.meta.env.VITE_API_URL + '/ws/state';
const accountUrl = import.meta.env.VITE_API_URL + '/state/account';
const accountWsUrl = import.meta.env.VITE_API_URL + '/ws/state/account';

const tasksApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getAdditionalTeamData: build.query<TasksData, 'inbound' | 'account'>({
      query: (teamType) => ({
        url: teamType === 'inbound' ? inboundUrl : accountUrl,
      }),
      async onCacheEntryAdded(teamType, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        let ws: WebSocket | null = null;
        try {
          await cacheDataLoaded;
          ws = new WebSocket(`${teamType === 'inbound' ? inboundWsUrl : accountWsUrl}`);

          const listener = (event: MessageEvent) => {
            const dataFromSocket: WsTasksData = JSON.parse(event.data);

            if (dataFromSocket.type === WsTypes.MANGO_STATE) {
              updateCachedData((draft: TasksData) => {
                draft[WsTypes.MANGO] = { ...draft[WsTypes.MANGO], ...dataFromSocket.data };
              });
            }

            if (dataFromSocket.type === WsTypes.TICKETS) {
              updateCachedData((draft: TasksData) => {
                draft[WsTypes.TICKETS] = { ...draft[WsTypes.TICKETS], ...dataFromSocket.data };
              });
            }
            if (dataFromSocket.type === WsTypes.TASKS) {
              updateCachedData((draft: TasksData) => {
                draft[WsTypes.TASKS] = { ...draft[WsTypes.TASKS], ...dataFromSocket.data };
              });
            }
            if (dataFromSocket.type === WsTypes.VACATION) {
              updateCachedData((draft: TasksData) => {
                draft[WsTypes.VACATION] = { ...draft[WsTypes.VACATION], ...dataFromSocket.data };
              });
            }
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
