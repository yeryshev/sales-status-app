import { rtkApi } from '@/shared/api/rtkApi';
import { AdditionalUserData } from '../model/types/teamNewWebsocket';
import { triggerGlobalDataRefresh } from '@/shared/lib/hooks/useGlobalDataRefresh';
import { logger } from '@/shared/lib/utils/logger';

const externalApiUrl = import.meta.env.VITE_EXTERNAL_API_URL;
const externalSocketUrl = import.meta.env.VITE_EXTERNAL_SOCKET_URL;

// Глобальный менеджер WebSocket соединений для RTK Query
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
    // Добавляем слушатель
    if (!this.listeners.has(url)) {
      this.listeners.set(url, new Set());
    }
    this.listeners.get(url)!.add(onMessage);

    // Устанавливаем, поддерживает ли URL heartbeat
    if (enableHeartbeat) {
      this.heartbeatEnabledUrls.add(url);
    }

    // Если соединение уже существует и активно, просто добавляем слушатель
    const existingConnection = this.connections.get(url);
    if (existingConnection && existingConnection.readyState === WebSocket.OPEN) {
      return;
    }

    // Создаем новое соединение
    this.createConnection(url);
  }

  private createConnection(url: string) {
    try {
      const ws = new WebSocket(url);
      this.connections.set(url, ws);

      ws.onopen = () => {
        logger.log('RTK WebSocket connected:', url);
        this.reconnectAttempts.set(url, 0);
        // Запускаем heartbeat только если URL его поддерживает
        if (this.heartbeatEnabledUrls.has(url)) {
          this.startHeartbeat(url, ws);
        }

        // При восстановлении соединения обновляем данные
        const attempts = this.reconnectAttempts.get(url) || 0;
        if (attempts > 0) {
          logger.log('🔄 RTK WebSocket reconnected, refreshing data...');
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
        logger.log('RTK WebSocket disconnected:', url, event.code, event.reason);
        this.clearTimers(url);
        this.connections.delete(url);

        // Автоматическое переподключение
        const attempts = this.reconnectAttempts.get(url) || 0;
        if (attempts < this.maxReconnectAttempts) {
          this.reconnectAttempts.set(url, attempts + 1);
          logger.log(`RTK WebSocket reconnecting... Attempt ${attempts + 1}/${this.maxReconnectAttempts}`);

          const timer = setTimeout(() => {
            this.createConnection(url);
          }, this.reconnectInterval);

          this.reconnectTimers.set(url, timer);
        }
      };

      ws.onerror = (event) => {
        logger.error('RTK WebSocket error:', url, event);
      };
    } catch (error) {
      logger.error('Failed to create RTK WebSocket:', error);
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

      // Если больше нет слушателей, закрываем соединение
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

  // Обработка изменения видимости вкладки
  handleVisibilityChange() {
    if (!document.hidden && navigator.onLine) {
      // Когда вкладка становится видимой, проверяем все соединения
      this.connections.forEach((ws, wsUrl) => {
        if (ws.readyState !== WebSocket.OPEN && this.listeners.has(wsUrl)) {
          this.createConnection(wsUrl);
        }
      });
    }
  }

  // Обработка восстановления интернет-соединения
  handleOnline() {
    logger.log('Internet connection restored - checking RTK WebSocket connections');
    this.connections.forEach((ws, wsUrl) => {
      if (ws.readyState !== WebSocket.OPEN && this.listeners.has(wsUrl)) {
        this.createConnection(wsUrl);
      }
    });
  }

  // Обработка потери интернет-соединения
  handleOffline() {
    logger.log('Internet connection lost - RTK WebSocket connections affected');
    // Закрываем все соединения при потере интернета
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

const wsManager = new WebSocketManager();

// Глобальные обработчики событий
document.addEventListener('visibilitychange', () => {
  wsManager.handleVisibilityChange();
});

window.addEventListener('online', () => {
  wsManager.handleOnline();
});

window.addEventListener('offline', () => {
  wsManager.handleOffline();
});

const tasksApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getAdditionalTeamData: build.query<Array<AdditionalUserData>, void>({
      query: () => ({
        url: externalApiUrl,
        credentials: 'same-origin',
      }),
      async onCacheEntryAdded(_, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        const listener = (event: MessageEvent) => {
          try {
            const dataFromSocket: AdditionalUserData = JSON.parse(event.data);
            updateCachedData((draft: Array<AdditionalUserData>) => {
              const index = draft.findIndex((item) => item.idInside === dataFromSocket.idInside);
              if (index !== -1) {
                draft[index] = dataFromSocket;
              }
            });
          } catch (error) {
            logger.error('Error parsing WebSocket message:', error);
          }
        };

        try {
          await cacheDataLoaded;
          // Для VITE_EXTERNAL_SOCKET_URL не включаем heartbeat, так как это сторонний сервис
          wsManager.connect(externalSocketUrl, listener, false);
        } catch (error) {
          logger.error('Error occurred:', error);
        } finally {
          await cacheEntryRemoved;
          wsManager.disconnect(externalSocketUrl, listener);
        }
      },
    }),
  }),
});

export const useGetAdditionalTeamData = tasksApi.useGetAdditionalTeamDataQuery;
