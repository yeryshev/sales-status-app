import { rtkApi } from '@/shared/api/rtkApi';
import { TasksData, WsTasksData, WsTypes } from '../model/types/tasksWebsocket';

const tasksApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getAdditionalTeamData: build.query<TasksData, void>({
      query: () => ({
        url: import.meta.env.VITE_INBOUND_TEAM,
      }),
      async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        let ws: WebSocket | null = null;
        try {
          await cacheDataLoaded;
          ws = new WebSocket(`${import.meta.env.VITE_INBOUND_TEAM_SOCKET}`);

          const listener = (event: MessageEvent) => {
            const dataFromSocket: WsTasksData = JSON.parse(event.data);

            // if (dataFromSocket.type === WsTypes.MANGO) {
            //   updateCachedData((draft: TasksData) => {
            //     const extNumber = Object.keys(dataFromSocket.data)[0];
            //     draft[WsTypes.MANGO][extNumber] = dataFromSocket.data[extNumber];
            //   });
            // }

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
    getAdditionalAccountManagersTeamData: build.query<TasksData, void>({
      query: () => ({
        url: import.meta.env.VITE_ACCOUNT_MANAGERS,
      }),
      async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        let ws: WebSocket | null = null;
        try {
          await cacheDataLoaded;
          ws = new WebSocket(`${import.meta.env.VITE_ACCOUNT_MANAGERS_TEAM_SOCKET}`);

          const listener = (event: MessageEvent) => {
            const dataFromSocket: WsTasksData = JSON.parse(event.data);

            // if (dataFromSocket.type === WsTypes.MANGO) {
            //   updateCachedData((draft: TasksData) => {
            //     const extNumber = Object.keys(dataFromSocket.data)[0];
            //     draft[WsTypes.MANGO][extNumber] = dataFromSocket.data[extNumber];
            //   });
            // }

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
export const useGetAdditionalAccountManagersTeamData = tasksApi.useGetAdditionalAccountManagersTeamDataQuery;
