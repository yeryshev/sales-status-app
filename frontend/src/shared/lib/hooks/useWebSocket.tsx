import { useCallback, useEffect, useRef, useState } from 'react';

interface UseWebSocketConfig {
  url: string;
  heartbeatInterval?: number; // в миллисекундах
  reconnectInterval?: number; // в миллисекундах
  maxReconnectAttempts?: number;
  enableHeartbeat?: boolean; // включить heartbeat (по умолчанию true)
  onMessage?: (event: MessageEvent) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (event: Event) => void;
}

interface WebSocketState {
  socket: WebSocket | null;
  isConnected: boolean;
  isConnecting: boolean;
  reconnectAttempts: number;
  lastError: Event | null;
  isOnline: boolean;
}

export const useWebSocket = (config: UseWebSocketConfig) => {
  const {
    url,
    heartbeatInterval = 30000, // 30 секунд
    reconnectInterval = 3000, // 3 секунды
    maxReconnectAttempts = 5,
    enableHeartbeat = true, // по умолчанию включен
    onMessage,
    onConnect,
    onDisconnect,
    onError,
  } = config;

  const [state, setState] = useState<WebSocketState>({
    socket: null,
    isConnected: false,
    isConnecting: false,
    reconnectAttempts: 0,
    lastError: null,
    isOnline: navigator.onLine,
  });

  const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isManuallyClosedRef = useRef(false);
  const lastPingTimeRef = useRef<number>(0);
  const heartbeatTimeoutDuration = 10000; // 10 секунд ожидания ответа на ping

  const clearTimers = useCallback(() => {
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = null;
    }
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  const startHeartbeat = useCallback((socket: WebSocket) => {
    if (!enableHeartbeat) {
      return;
    }
    
    clearTimers();
    heartbeatTimerRef.current = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN && navigator.onLine) {
        // Отправляем ping и запускаем таймер ожидания ответа
        lastPingTimeRef.current = Date.now();
        socket.send(JSON.stringify({ type: 'ping' }));
        
        // Устанавливаем таймер ожидания ответа
        heartbeatTimeoutRef.current = setTimeout(() => {
          // Если за 10 секунд не получили pong, считаем соединение потерянным
          console.warn('Heartbeat timeout - no pong received');
          setState(prev => ({ ...prev, isConnected: false }));
          
          // Принудительно закрываем сокет и переподключаемся
          if (socket.readyState === WebSocket.OPEN) {
            socket.close();
          }
        }, heartbeatTimeoutDuration);
      } else if (!navigator.onLine) {
        // Если нет интернета, обновляем статус
        setState(prev => ({ ...prev, isConnected: false, isOnline: false }));
      }
    }, heartbeatInterval);
  }, [heartbeatInterval, enableHeartbeat, clearTimers, heartbeatTimeoutDuration]);

  const connect = useCallback(() => {
    if (state.isConnecting || (state.socket && state.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true }));

    try {
      const socket = new WebSocket(url);

      socket.onopen = () => {
        console.log('WebSocket connected');
        setState(prev => ({
          ...prev,
          socket,
          isConnected: true,
          isConnecting: false,
          reconnectAttempts: 0,
          lastError: null,
          isOnline: navigator.onLine,
        }));
        startHeartbeat(socket);
        onConnect?.();
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Обрабатываем pong сообщения если heartbeat включен
          if (data.type === 'pong' && enableHeartbeat) {
            // Получили pong - отменяем таймер ожидания
            if (heartbeatTimeoutRef.current) {
              clearTimeout(heartbeatTimeoutRef.current);
              heartbeatTimeoutRef.current = null;
            }
            // Обновляем статус соединения
            setState(prev => ({ 
              ...prev, 
              isConnected: true, 
              isOnline: navigator.onLine 
            }));
            return;
          }
        } catch (e) {
          // Если не JSON, обрабатываем как обычное сообщение
        }
        onMessage?.(event);
      };

      socket.onclose = (event) => {
        console.log('WebSocket disconnected', event.code, event.reason);
        clearTimers();
        setState(prev => ({
          ...prev,
          socket: null,
          isConnected: false,
          isConnecting: false,
          isOnline: navigator.onLine,
        }));
        
        onDisconnect?.();

        // Автоматическое переподключение, если соединение не было закрыто вручную
        if (!isManuallyClosedRef.current && state.reconnectAttempts < maxReconnectAttempts) {
          setState(prev => ({ ...prev, reconnectAttempts: prev.reconnectAttempts + 1 }));
          reconnectTimerRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      socket.onerror = (event) => {
        console.error('WebSocket error:', event);
        setState(prev => ({
          ...prev,
          lastError: event,
          isConnecting: false,
        }));
        onError?.(event);
      };

    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setState(prev => ({
        ...prev,
        isConnecting: false,
        lastError: error as Event,
      }));
    }
  }, [url, state.isConnecting, state.socket, state.reconnectAttempts, maxReconnectAttempts, 
      reconnectInterval, startHeartbeat, onConnect, onMessage, onDisconnect, onError]);

  const disconnect = useCallback(() => {
    isManuallyClosedRef.current = true;
    clearTimers();
    
    if (state.socket && state.socket.readyState === WebSocket.OPEN) {
      state.socket.close();
    }
    
    setState(prev => ({
      ...prev,
      socket: null,
      isConnected: false,
      isConnecting: false,
      reconnectAttempts: 0,
    }));
  }, [state.socket, clearTimers]);

  const reconnect = useCallback(() => {
    setState(prev => ({ ...prev, reconnectAttempts: 0 }));
    isManuallyClosedRef.current = false;
    disconnect();
    setTimeout(connect, 100);
  }, [disconnect, connect]);

  const sendMessage = useCallback((data: any) => {
    if (state.socket && state.socket.readyState === WebSocket.OPEN) {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      state.socket.send(message);
      return true;
    }
    return false;
  }, [state.socket]);

  // Обработка изменения видимости вкладки
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !state.isConnected && !state.isConnecting) {
        // Когда вкладка становится видимой и соединение потеряно, переподключаемся
        isManuallyClosedRef.current = false;
        connect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [state.isConnected, state.isConnecting, connect]);

  // Обработка события перехода в онлайн/офлайн
  useEffect(() => {
    const handleOnline = () => {
      console.log('Internet connection restored');
      setState(prev => ({ ...prev, isOnline: true }));
      
      if (!state.isConnected && !state.isConnecting) {
        isManuallyClosedRef.current = false;
        connect();
      }
    };

    const handleOffline = () => {
      console.log('Internet connection lost');
      setState(prev => ({ ...prev, isOnline: false, isConnected: false }));
      clearTimers();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [state.isConnected, state.isConnecting, connect, clearTimers]);

  // Инициализация соединения
  useEffect(() => {
    isManuallyClosedRef.current = false;
    connect();

    return () => {
      isManuallyClosedRef.current = true;
      clearTimers();
      if (state.socket) {
        state.socket.close();
      }
    };
  }, [url]); // Только при изменении URL

  // Cleanup при размонтировании
  useEffect(() => {
    return () => {
      clearTimers();
      if (state.socket) {
        state.socket.close();
      }
    };
  }, []);

  return {
    socket: state.socket,
    isConnected: state.isConnected && state.isOnline, // соединение активно только если есть интернет
    isConnecting: state.isConnecting,
    reconnectAttempts: state.reconnectAttempts,
    lastError: state.lastError,
    isOnline: state.isOnline,
    connect,
    disconnect,
    reconnect,
    sendMessage,
  };
}; 