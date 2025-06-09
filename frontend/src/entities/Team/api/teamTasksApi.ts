import { rtkApi } from '@/shared/api/rtkApi';
import { TasksData, WsTasksData, WsTypes } from '../model/types/teamWebsocket';
import { triggerGlobalDataRefresh } from '@/shared/lib/hooks/useGlobalDataRefresh';

const apiBaseUrl = import.meta.env.VITE_API_URL;

const inboundUrl = apiBaseUrl + '/state';
const inboundWsUrl = apiBaseUrl + '/ws/state';
const accountUrl = apiBaseUrl + '/state/account';
const accountWsUrl = apiBaseUrl + '/ws/state/account';

// Используем тот же WebSocketManager из teamInfoApi
class WebSocketManager {
  private connections = new Map<string, WebSocket>();
  private listeners = new Map<string, Set<(event: MessageEvent) => void>>();
  private reconnectTimers = new Map<string, NodeJS.Timeout>();
  private heartbeatTimers = new Map<string, NodeJS.Timeout>();
  private reconnectAttempts = new Map<string, number>();
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;
  private heartbeatInterval = 30000;
  private heartbeatEnabledUrls = new Set<string>(); // URLs, поддерживающие heartbeat

  connect(url: string, onMessage: (event: MessageEvent) => void, enableHeartbeat = false) {
    if (!this.listeners.has(url)) {
      this.listeners.set(url, new Set());
    }
    this.listeners.get(url)!.add(onMessage);

    // Устанавливаем, поддерживает ли URL heartbeat
    if (enableHeartbeat) {
      this.heartbeatEnabledUrls.add(url);
    }

    const existingConnection = this.connections.get(url);
    if (existingConnection && existingConnection.readyState === WebSocket.OPEN) {
      return;
    }

    this.createConnection(url);
  }

  private createConnection(url: string) {
    try {
      const ws = new WebSocket(url);
      this.connections.set(url, ws);

      ws.onopen = () => {
        console.log('Tasks RTK WebSocket connected:', url);
        this.reconnectAttempts.set(url, 0);
        // Запускаем heartbeat только если URL его поддерживает
        if (this.heartbeatEnabledUrls.has(url)) {
          this.startHeartbeat(url, ws);
        }

        // При восстановлении соединения обновляем данные
        const attempts = this.reconnectAttempts.get(url) || 0;
        if (attempts > 0) {
          console.log('🔄 Tasks RTK WebSocket reconnected, refreshing data...');
          triggerGlobalDataRefresh();
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Игнорируем pong сообщения только если heartbeat включен для этого URL
          if (data.type === 'pong' && this.heartbeatEnabledUrls.has(url)) return;
        } catch {
          // Не JSON, обрабатываем как обычное сообщение
        }

        const listeners = this.listeners.get(url);
        if (listeners) {
          listeners.forEach((listener) => listener(event));
        }
      };

      ws.onclose = (event) => {
        console.log('Tasks RTK WebSocket disconnected:', url, event.code, event.reason);
        this.clearTimers(url);
        this.connections.delete(url);

        const attempts = this.reconnectAttempts.get(url) || 0;
        if (attempts < this.maxReconnectAttempts) {
          this.reconnectAttempts.set(url, attempts + 1);
          console.log(`Tasks RTK WebSocket reconnecting... Attempt ${attempts + 1}/${this.maxReconnectAttempts}`);

          const timer = setTimeout(() => {
            this.createConnection(url);
          }, this.reconnectInterval);

          this.reconnectTimers.set(url, timer);
        }
      };

      ws.onerror = (event) => {
        console.error('Tasks RTK WebSocket error:', url, event);
      };
    } catch (error) {
      console.error('Failed to create Tasks RTK WebSocket:', error);
    }
  }

  private startHeartbeat(url: string, ws: WebSocket) {
    // Запускаем heartbeat только если URL его поддерживает
    if (!this.heartbeatEnabledUrls.has(url)) {
      return;
    }

    this.clearHeartbeat(url);
    const timer = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, this.heartbeatInterval);
    this.heartbeatTimers.set(url, timer);
  }

  private clearTimers(url: string) {
    this.clearHeartbeat(url);
    this.clearReconnectTimer(url);
  }

  private clearHeartbeat(url: string) {
    const timer = this.heartbeatTimers.get(url);
    if (timer) {
      clearInterval(timer);
      this.heartbeatTimers.delete(url);
    }
  }

  private clearReconnectTimer(url: string) {
    const timer = this.reconnectTimers.get(url);
    if (timer) {
      clearTimeout(timer);
      this.reconnectTimers.delete(url);
    }
  }

  disconnect(url: string, onMessage: (event: MessageEvent) => void) {
    const listeners = this.listeners.get(url);
    if (listeners) {
      listeners.delete(onMessage);

      if (listeners.size === 0) {
        this.listeners.delete(url);
        this.clearTimers(url);

        const ws = this.connections.get(url);
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
        this.connections.delete(url);
        this.reconnectAttempts.delete(url);
        this.heartbeatEnabledUrls.delete(url);
      }
    }
  }

  handleVisibilityChange() {
    if (!document.hidden && navigator.onLine) {
      this.connections.forEach((ws, wsUrl) => {
        if (ws.readyState !== WebSocket.OPEN && this.listeners.has(wsUrl)) {
          this.createConnection(wsUrl);
        }
      });
    }
  }

  handleOnline() {
    console.log('Internet connection restored - checking Tasks RTK WebSocket connections');
    this.connections.forEach((ws, wsUrl) => {
      if (ws.readyState !== WebSocket.OPEN && this.listeners.has(wsUrl)) {
        this.createConnection(wsUrl);
      }
    });
  }

  handleOffline() {
    console.log('Internet connection lost - Tasks RTK WebSocket connections affected');
    this.connections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    });
    this.clearAllTimers();
  }

  private clearAllTimers() {
    this.heartbeatTimers.forEach((timer) => clearInterval(timer));
    this.reconnectTimers.forEach((timer) => clearTimeout(timer));
    this.heartbeatTimers.clear();
    this.reconnectTimers.clear();
  }
}

const tasksWsManager = new WebSocketManager();

// Глобальные обработчики событий для tasks WebSocket
document.addEventListener('visibilitychange', () => {
  tasksWsManager.handleVisibilityChange();
});

window.addEventListener('online', () => {
  tasksWsManager.handleOnline();
});

window.addEventListener('offline', () => {
  tasksWsManager.handleOffline();
});

const tasksApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getAdditionalTeamData: build.query<TasksData, 'inbound' | 'account'>({
      query: (teamType) => ({
        url: teamType === 'inbound' ? inboundUrl : accountUrl,
      }),
      async onCacheEntryAdded(teamType, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        const wsUrl = teamType === 'inbound' ? inboundWsUrl : accountWsUrl;

        const listener = (event: MessageEvent) => {
          try {
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
          } catch (error) {
            console.error('Error parsing Tasks WebSocket message:', error);
          }
        };

        try {
          await cacheDataLoaded;
          // Для VITE_API_URL не включаем heartbeat, так как это сторонний сервис
          tasksWsManager.connect(wsUrl, listener, false);
        } catch (error) {
          console.error('Error occurred:', error);
        } finally {
          await cacheEntryRemoved;
          tasksWsManager.disconnect(wsUrl, listener);
        }
      },
    }),
  }),
});

export const useGetAdditionalTeamData = tasksApi.useGetAdditionalTeamDataQuery;
