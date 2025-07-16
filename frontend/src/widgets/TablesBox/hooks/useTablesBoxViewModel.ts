import { useCallback, useEffect, useState, SyntheticEvent, useRef } from 'react';
import { useSelector } from 'react-redux';

import { getUserData, userActions, User } from '@/entities/User';
import { teamActions, UserWsUpdates, fetchTeamList } from '@/entities/Team';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch';
import { useWebSocket } from '@/shared/lib/hooks/useWebSocket';
import { useDataRefresh } from '@/shared/lib/hooks/useDataRefresh';
import { useGlobalDataRefresh, setGlobalRefreshFunction } from '@/shared/lib/hooks/useGlobalDataRefresh';
import { logger } from '@/shared/lib/utils/logger';
import { useDeadlinesCheck } from './useDeadlines';

export const useTablesBoxViewModel = (teamList: User[], teamIsLoading: boolean) => {
  const dispatch = useAppDispatch();
  const user = useSelector(getUserData);
  const [tabNumber, setTabNumber] = useState(0);
  const lastLocalUpdateRef = useRef<number>(0);

  const deadlines = useDeadlinesCheck(teamList, teamIsLoading);
  const { refreshAllData } = useDataRefresh();
  const { refreshGlobalData } = useGlobalDataRefresh();

  const handleChangeTab = useCallback((_: SyntheticEvent, newTab: number) => {
    setTabNumber(newTab);
  }, []);

  // Инициализация данных
  useEffect(() => {
    dispatch(fetchTeamList());
  }, [dispatch]);

  // Установка глобальной функции обновления
  useEffect(() => {
    setGlobalRefreshFunction(refreshGlobalData);
  }, [refreshGlobalData]);

  // WebSocket обработчики
  // Примечание: В консоли будут видны два типа сообщений WebSocket:
  // 1. "🔌 WebSocket connected to: ..." - общее техническое подключение (из useWebSocket hook)
  // 2. "✅ Status updates WebSocket ready - ..." - готовность системы обновления статусов (этот callback)
  const handleStatusChange = useCallback(
    (event: MessageEvent) => {
      const dataFromSocket: UserWsUpdates = JSON.parse(event.data);

      if ('users' in dataFromSocket) {
        dispatch(teamActions.setTeamLocalByAllUsers(dataFromSocket.users));
        const currentUserFromWs = dataFromSocket.users.find((wsUser) => wsUser.id === user?.id);

        if (currentUserFromWs) {
          const { statusId, status, busyTime, updatedAt, isWorkingRemotely } = currentUserFromWs;

          // Проверяем, не было ли локального обновления в последние 2 секунды
          const now = Date.now();
          if (now - lastLocalUpdateRef.current > 2000) {
            dispatch(
              userActions.updateUserLocal({
                statusId,
                status,
                busyTime,
                isWorkingRemotely,
                updatedAt,
              }),
            );
          }
        }
      }

      if ('user' in dataFromSocket) {
        const { id, updatedAt, isWorkingRemotely } = dataFromSocket.user;

        if ('statusId' in dataFromSocket.user && user) {
          const { statusId, status, busyTime } = dataFromSocket.user;
          dispatch(
            teamActions.setTeamLocalByOneUser({
              id,
              statusId,
              status,
              busyTime,
              isWorkingRemotely,
              updatedAt,
            }),
          );

          if (id === user.id) {
            // Проверяем, не было ли локального обновления в последние 2 секунды
            const now = Date.now();
            if (now - lastLocalUpdateRef.current > 2000) {
              dispatch(
                userActions.updateUserLocal({
                  statusId,
                  status,
                  busyTime,
                  isWorkingRemotely,
                }),
              );
            }
          }
        }
      }
    },
    [dispatch, user],
  );

  const handleWebSocketConnect = useCallback(() => {
    logger.log('✅ Status updates WebSocket ready - real-time status synchronization active');
    refreshAllData();
  }, [refreshAllData]);

  const handleWebSocketDisconnect = useCallback(() => {
    logger.log('❌ Status updates WebSocket disconnected - real-time synchronization paused');
  }, []);

  const handleWebSocketError = useCallback((event: Event) => {
    logger.error('⚠️  Status updates WebSocket error:', event);
  }, []);

  const websocketState = useWebSocket({
    url: import.meta.env.VITE_SOCKET_URL,
    onMessage: handleStatusChange,
    onConnect: handleWebSocketConnect,
    onDisconnect: handleWebSocketDisconnect,
    onError: handleWebSocketError,
    heartbeatInterval: 30000,
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
    enableHeartbeat: true,
  });

  return {
    tabNumber,
    handleChangeTab,
    deadlines,
    websocketState,
    lastLocalUpdateRef,
  };
};
