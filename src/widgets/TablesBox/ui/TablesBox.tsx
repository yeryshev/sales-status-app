import { Tooltip } from '@mui/material';
import { TeamTable } from './TeamTable/TeamTable';
import { useSelector } from 'react-redux';
import { memo, ReactNode, SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { getUserData, User } from '@/entities/User';
import { statusActions } from '@/entities/Status';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import Box from '@mui/system/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { LastWeekTable } from './TeamResults/LastWeekResults/LastWeekTable';
import { CurrentWeekResultTable } from './TeamResults/CurrentWeekResult/CurrentWeekResultTable';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router-dom';
import moment from 'moment/moment';
import {
  fetchTeamList,
  getAccountManagerTeamList,
  getInboundTeamList,
  getTeamIsLoading,
  teamActions,
  teamReducer,
  useGetAdditionalTeamData,
} from '@/entities/Team';
import { AppRoutes, RoutePath } from '@/shared/const/router';
import { Helmet } from 'react-helmet';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

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

  let teamList;
  isAccountManagersRoute ? (teamList = accountManagerTeamList) : (teamList = inboundTeamList);

  const { data: additionalTeamData } = useGetAdditionalTeamData(isAccountManagersRoute ? 'account' : 'inbound');

  const deadlinesNumbersObj = useMemo(() => {
    const obj: Record<User['id'], number> = {};
    teamList.forEach((user) => {
      if (user.busyTime) {
        obj[user.id] = moment.utc(user.busyTime.endTime).valueOf();
      }
    });
    return obj;
  }, [teamList]);

  const checkDeadlines = useCallback((deadlinesNumbersObj: Record<User['id'], number>) => {
    const currentTimeUTC = moment().utc().valueOf();
    const deadlinesStatesObj: Record<User['id'], boolean> = {};
    for (const key in deadlinesNumbersObj) {
      deadlinesStatesObj[key] = currentTimeUTC >= deadlinesNumbersObj[key];
    }
    return deadlinesStatesObj;
  }, []);

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
  }, [teamIsLoading, teamList, deadlinesNumbersObj, checkDeadlines]);

  const {
    tasks = {},
    tickets = {},
    mango = {},
    vacation = {},
    lastWeekStat = {},
    avatarsAndBirthday = {},
  } = additionalTeamData || {};

  const handleChangeTab = (_: SyntheticEvent, newTab: number) => {
    setTabNumber(newTab);
  };

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
      const dataFromSocket = JSON.parse(event.data);
      const { userId, updatedAt, isWorkingRemotely } = dataFromSocket;

      if ('statusId' in dataFromSocket && user) {
        const { statusId, status, busyTime } = dataFromSocket;
        dispatch(
          teamActions.setTeamLocal({
            userId,
            statusId,
            status,
            busyTime,
            isWorkingRemotely,
            updatedAt,
          }),
        );
        dispatch(statusActions.changeStatus(user.statusId));
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
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabNumber} onChange={handleChangeTab} aria-label="basic tabs">
            <Tab label="Команда" {...a11yProps(0)} />
            <Tooltip
              title={
                <Typography variant={'inherit'}>
                  Рейтинг менеджеров по новым клиентам
                  <br />
                  ТОП 3 получают бейджи каждую неделю
                </Typography>
              }
            >
              <Tab label="Успехи" {...a11yProps(1)} />
            </Tooltip>
          </Tabs>
        </Box>
        <CustomTabPanel value={tabNumber} index={0}>
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
        </CustomTabPanel>
        <CustomTabPanel value={tabNumber} index={1}>
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
        </CustomTabPanel>
      </Box>
    </DynamicModuleLoader>
  );
});
