import { TeamTable } from './TeamTable/TeamTable';
import { useSelector } from 'react-redux';
import { memo, SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { getUserData, userActions } from '@/entities/User';
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
import { handleVisibilityChange } from '../lib/visibilityChangeHandler';
import { useDeadlinesCheck } from '../lib/useDeadlines';

const reducers: ReducersList = {
  teamTable: teamReducer,
};

const statusCommentsSocket = new WebSocket(import.meta.env.VITE_SOCKET_URL);

export const TablesBox = memo(() => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isAccountManagersRoute = location.pathname === RoutePath[AppRoutes.ACCOUNT_MANAGERS];
  const teamIsLoading = useSelector(getTeamIsLoading);
  const inboundTeamList = useSelector(getInboundTeamList);
  const accountManagerTeamList = useSelector(getAccountManagerTeamList);
  const teamList = isAccountManagersRoute ? accountManagerTeamList : inboundTeamList;
  const { data: additionalTeamData } = useGetAdditionalTeamData(isAccountManagersRoute ? 'account' : 'inbound');
  const user = useSelector(getUserData);
  const [tabNumber, setTabNumber] = useState(0);
  const deadlines = useDeadlinesCheck(teamList, teamIsLoading);

  const {
    tasks = {},
    tickets = {},
    mango = {},
    vacation = {},
    lastWeekStat = {},
    avatarsAndBirthday = {},
  } = additionalTeamData || {};

  const handleChangeTab = useCallback((_: SyntheticEvent, newTab: number) => {
    setTabNumber(newTab);
  }, []);

  useEffect(() => {
    dispatch(fetchTeamList());
  }, [dispatch]);

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
