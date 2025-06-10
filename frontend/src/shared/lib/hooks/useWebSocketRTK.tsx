import { useCallback, useEffect, useRef } from 'react';
import { logger } from '../utils/logger';

interface UseWebSocketRTKConfig {
  url: string;
  onMessage: (event: MessageEvent) => void;
  onError?: (event: Event) => void;
  heartbeatInterval?: number;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export const useWebSocketRTK = (config: UseWebSocketRTKConfig) => {
  const {
    url,
    onMessage,
    onError,
    heartbeatInterval = 30000,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
  } = config;

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isManuallyClosedRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  const startHeartbeat = useCallback(
    (socket: WebSocket) => {
      clearTimers();
      heartbeatTimerRef.current = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'ping' }));
        }
      }, heartbeatInterval);
    },
    [heartbeatInterval, clearTimers],
  );

  const connect = useCallback(() => {
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.CONNECTING || wsRef.current.readyState === WebSocket.OPEN)
    ) {
      return wsRef.current;
    }

    try {
      const socket = new WebSocket(url);
      wsRef.current = socket;

      socket.onopen = () => {
        logger.log('RTK WebSocket connected:', url);
        reconnectAttemptsRef.current = 0;
        startHeartbeat(socket);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'pong') {
            return;
          }
        } catch {
          // Если не JSON, обрабатываем как обычное сообщение
        }
        onMessage(event);
      };

      socket.onclose = (event) => {
        logger.log('RTK WebSocket disconnected:', url, event.code, event.reason);
        clearTimers();
        wsRef.current = null;

        // Автоматическое переподключение
        if (!isManuallyClosedRef.current && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          logger.log(`RTK WebSocket reconnecting... Attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`);

          reconnectTimerRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      socket.onerror = (event) => {
        logger.error('RTK WebSocket error:', url, event);
        onError?.(event);
      };

      return socket;
    } catch (error) {
      logger.error('Failed to create RTK WebSocket:', error);
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, onMessage, onError, startHeartbeat, maxReconnectAttempts, reconnectInterval]); // clearTimers стабилен через useCallback

  const disconnect = useCallback(() => {
    isManuallyClosedRef.current = true;
    clearTimers();

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }

    wsRef.current = null;
    reconnectAttemptsRef.current = 0;
  }, [clearTimers]);

  // Обработка изменения видимости вкладки
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !wsRef.current) {
        isManuallyClosedRef.current = false;
        connect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [connect]);

  // Обработка события перехода в онлайн/офлайн
  useEffect(() => {
    const handleOnline = () => {
      if (!wsRef.current) {
        isManuallyClosedRef.current = false;
        connect();
      }
    };

    const handleOffline = () => {
      clearTimers();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [connect, clearTimers]);

  return {
    connect,
    disconnect,
    getSocket: () => wsRef.current,
  };
};
