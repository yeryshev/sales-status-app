import { TeamTable } from './TeamTable/TeamTable';
import { useSelector } from 'react-redux';
import { memo, SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { getUserData, User, userActions } from '@/entities/User';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import Box from '@mui/system/Box';
import { LastWeekTable } from './TeamResults/LastWeekResults/LastWeekTable';
import { CurrentWeekResultTable } from './TeamResults/CurrentWeekResult/CurrentWeekResultTable';
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
import { checkDeadlines, getDeadlineNumbersObject } from '../lib/deadlineHelpers';

const reducers: ReducersList = {
  teamTable: teamReducer,
};

const statusCommentsSocket = new WebSocket(import.meta.env.VITE_SOCKET_URL);

const handleVisibilityChange = (socket: WebSocket) => {
  if (!document.hidden) {
    if (socket.readyState !== WebSocket.OPEN) {
      window.location.reload();
    }
  }
};

const INTERVAL_MS = 30000;

export const TablesBox = memo(() => {
  const user = useSelector(getUserData);
  const inboundTeamList = useSelector(getInboundTeamList);
  const accountManagerTeamList = useSelector(getAccountManagerTeamList);
  const teamIsLoading = useSelector(getTeamIsLoading);
  const dispatch = useAppDispatch();
  const [tabNumber, setTabNumber] = useState(0);
  const location = useLocation();
  const [deadlines, setDeadlines] = useState<Record<User['id'], boolean>>({});
  const isAccountManagersRoute = location.pathname === RoutePath[AppRoutes.ACCOUNT_MANAGERS];
  const { data: additionalTeamData } = useGetAdditionalTeamData(isAccountManagersRoute ? 'account' : 'inbound');

  const {
    tasks = {},
    tickets = {},
    mango = {},
    vacation = {},
    lastWeekStat = {},
    avatarsAndBirthday = {},
  } = additionalTeamData || {};

  let teamList: User[];
  isAccountManagersRoute ? (teamList = accountManagerTeamList) : (teamList = inboundTeamList);

  const deadlinesNumbersObj = getDeadlineNumbersObject(teamList);

  useEffect(() => {
    if (!teamIsLoading && teamList.length > 0) {
      const isDeadlineReachedObject = checkDeadlines(deadlinesNumbersObj);
      setDeadlines(isDeadlineReachedObject);

      const intervalId = setInterval(() => {
        const isDeadlineReachedObject = checkDeadlines(deadlinesNumbersObj);
        setDeadlines(isDeadlineReachedObject);
      }, INTERVAL_MS);

      return () => clearInterval(intervalId);
    }
  }, [teamIsLoading, teamList, deadlinesNumbersObj]);

  const handleChangeTab = useCallback((_: SyntheticEvent, newTab: number) => {
    setTabNumber(newTab);
  }, []);

  useEffect(() => {
    document.addEventListener('visibilitychange', () => {
      handleVisibilityChange(statusCommentsSocket);
    });

    return () => {
      document.removeEventListener('visibilitychange', () => {
        handleVisibilityChange(statusCommentsSocket);
      });
    };
  }, []);

  const handleStatusChange = useCallback(
    (event: MessageEvent) => {
      const dataFromSocket: UserWsUpdates = JSON.parse(event.data);
      const { id, updatedAt, isWorkingRemotely } = dataFromSocket;

      if ('statusId' in dataFromSocket && user) {
        const { statusId, status, busyTime } = dataFromSocket;
        dispatch(
          teamActions.setTeamLocal({
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
    },
    [dispatch, user],
  );

  useEffect(() => {
    statusCommentsSocket.addEventListener('message', handleStatusChange);

    return () => {
      statusCommentsSocket.removeEventListener('message', handleStatusChange);
    };
  }, [handleStatusChange]);

  useEffect(() => {
    dispatch(fetchTeamList());
  }, [dispatch]);

  return (
    <DynamicModuleLoader reducers={reducers}>
      <Helmet>
        <title>{isAccountManagersRoute ? 'Аккаунт менеджеры' : 'Входящие'}</title>
      </Helmet>
      <Box sx={{ width: '100%' }}>
        <TeamTableTabs tabNumber={tabNumber} handleChangeTab={handleChangeTab} />
        <TeamTableTabPanel value={tabNumber} index={0}>
          <TeamTable
            teamList={teamList}
            teamIsLoading={teamIsLoading}
            mango={mango}
            tasks={tasks}
            tickets={tickets}
            vacationStates={vacation}
            avatarsAndBirthday={avatarsAndBirthday}
            isDeadlineReachedObject={deadlines}
            isAccountManagersRoute={isAccountManagersRoute}
          />
        </TeamTableTabPanel>
        <TeamTableTabPanel value={tabNumber} index={1}>
          <Box display={'flex'} gap={2} flexDirection={{ sm: 'column', md: 'row' }}>
            <CurrentWeekResultTable
              teamList={teamList}
              teamIsLoading={teamIsLoading}
              tasks={tasks}
              avatarsAndBirthday={avatarsAndBirthday}
              isAccountManagersRoute={isAccountManagersRoute}
            />
            <LastWeekTable
              teamList={teamList}
              teamIsLoading={teamIsLoading}
              tasks={tasks}
              lastWeekStats={lastWeekStat}
              isAccountManagersRoute={isAccountManagersRoute}
            />
          </Box>
        </TeamTableTabPanel>
      </Box>
    </DynamicModuleLoader>
  );
});
