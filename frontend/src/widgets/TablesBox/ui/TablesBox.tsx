import { TeamTable } from './TeamTable/TeamTable';
import { useSelector } from 'react-redux';
import { memo, SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { getUserData, userActions } from '@/entities/User';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import Box from '@mui/system/Box';
import { TeamResultsTable } from './TeamResults/TeamResultsTable';
import { useLocation } from 'react-router-dom';
import {
  fetchTeamList,
  getAccountManagerTeamList,
  getInboundTeamList,
  getTeamIsLoading,
  teamActions,
  teamReducer,
  useGetAdditionalTeamData,
  UserWsUpdates,
} from '@/entities/Team';
import { AppRoutes, RoutePath } from '@/shared/const/router';
import { Helmet } from 'react-helmet';
import { TeamTableTabPanel, TeamTableTabs } from '@/features/TeamTableTabs';
import { useWebSocket } from '@/shared/lib/hooks/useWebSocket';
import { useDeadlinesCheck } from '../hooks/useDeadlines';
import { WebSocketStatus } from '@/shared/ui/WebSocketStatus/WebSocketStatus';
import { useDataRefresh } from '@/shared/lib/hooks/useDataRefresh';
import { useGlobalDataRefresh, setGlobalRefreshFunction } from '@/shared/lib/hooks/useGlobalDataRefresh';

const reducers: ReducersList = {
  teamTable: teamReducer,
};

export const TablesBox = memo(() => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isAccountManagersRoute = location.pathname === RoutePath[AppRoutes.ACCOUNT_MANAGERS];
  const teamIsLoading = useSelector(getTeamIsLoading);
  const inboundTeamList = useSelector(getInboundTeamList);
  const accountManagerTeamList = useSelector(getAccountManagerTeamList);
  const teamList = isAccountManagersRoute ? accountManagerTeamList : inboundTeamList;
  const { data: additionalTeamData = [] } = useGetAdditionalTeamData(undefined, {
    skip: !import.meta.env.VITE_NEW_API_URL, // Не выполнять запрос, если URL не настроен
  });
  const user = useSelector(getUserData);
  const [tabNumber, setTabNumber] = useState(0);
  const deadlines = useDeadlinesCheck(teamList, teamIsLoading);
  const { refreshAllData } = useDataRefresh();
  const { refreshGlobalData } = useGlobalDataRefresh();

  const handleChangeTab = useCallback((_: SyntheticEvent, newTab: number) => {
    setTabNumber(newTab);
  }, []);

  useEffect(() => {
    dispatch(fetchTeamList());
  }, [dispatch]);

  // Устанавливаем глобальную функцию для обновления данных
  useEffect(() => {
    setGlobalRefreshFunction(refreshGlobalData);
  }, [refreshGlobalData]);

  const handleStatusChange = useCallback(
    (event: MessageEvent) => {
      const dataFromSocket: UserWsUpdates = JSON.parse(event.data);
      if ('users' in dataFromSocket) {
        dispatch(teamActions.setTeamLocalByAllUsers(dataFromSocket.users));
        const currentUserFromWs = dataFromSocket.users.find((wsUser) => wsUser.id === user?.id);
        if (currentUserFromWs) {
          const { statusId, status, busyTime, updatedAt, isWorkingRemotely } = currentUserFromWs;
          dispatch(userActions.updateUserLocal({ statusId, status, busyTime, isWorkingRemotely, updatedAt }));
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
            dispatch(userActions.updateUserLocal({ statusId, status, busyTime, isWorkingRemotely }));
          }
        }
      }
    },
    [dispatch, user],
  );

  const handleWebSocketConnect = useCallback(() => {
    console.log('Status WebSocket connected successfully');
    refreshAllData();
  }, [refreshAllData]);

  const handleWebSocketDisconnect = useCallback(() => {
    console.log('Status WebSocket disconnected');
  }, []);

  const handleWebSocketError = useCallback((event: Event) => {
    console.error('Status WebSocket error:', event);
  }, []);

  const { isConnected, isConnecting, reconnectAttempts, isOnline } = useWebSocket({
    url: import.meta.env.VITE_SOCKET_URL,
    onMessage: handleStatusChange,
    onConnect: handleWebSocketConnect,
    onDisconnect: handleWebSocketDisconnect,
    onError: handleWebSocketError,
    heartbeatInterval: 30000, // 30 секунд
    reconnectInterval: 3000, // 3 секунды
    maxReconnectAttempts: 5,
    enableHeartbeat: true, // Для VITE_SOCKET_URL включаем heartbeat (ваш сервис)
  });

  return (
    <DynamicModuleLoader reducers={reducers}>
      <Helmet>
        <title>{isAccountManagersRoute ? 'Аккаунт менеджеры' : 'Входящие'}</title>
      </Helmet>
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <TeamTableTabs tabNumber={tabNumber} handleChangeTab={handleChangeTab} />
          <WebSocketStatus
            isConnected={isConnected}
            isConnecting={isConnecting}
            reconnectAttempts={reconnectAttempts}
            maxReconnectAttempts={5}
            isOnline={isOnline}
          />
        </Box>
        <TeamTableTabPanel value={tabNumber} index={0}>
          <TeamTable
            teamList={teamList}
            teamIsLoading={teamIsLoading}
            additionalTeamData={additionalTeamData}
            isDeadlineReachedObject={deadlines}
            isAccountManagersRoute={isAccountManagersRoute}
          />
        </TeamTableTabPanel>
        <TeamTableTabPanel value={tabNumber} index={1}>
          <Box display={'flex'} gap={2} flexDirection={{ xs: 'column', md: 'row' }}>
            <TeamResultsTable
              type="currentWeek"
              teamList={teamList}
              teamIsLoading={teamIsLoading}
              additionalTeamData={additionalTeamData}
              isAccountManagersRoute={isAccountManagersRoute}
            />
            <TeamResultsTable
              type="lastWeek"
              teamList={teamList}
              teamIsLoading={teamIsLoading}
              additionalTeamData={additionalTeamData}
              isAccountManagersRoute={isAccountManagersRoute}
            />
          </Box>
        </TeamTableTabPanel>
      </Box>
    </DynamicModuleLoader>
  );
});
