import { Tooltip } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { TeamTable } from '../TeamTable/TeamTable';
import { useSelector } from 'react-redux';
import { memo, ReactNode, SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { UserTable } from '../UserTable/UserTable';
import { checkUser, getUserData } from '@/entities/User';
import { teamActions, teamReducer } from '@/entities/Team/model/slice/teamSlice';
import { statusActions } from '@/entities/Status';
import { useAppDispatch } from '@/shared/lib/hooks/AppDispatch';
import { fetchAllComments } from '@/entities/Comment';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { getTeamIsLoading, getTeamList, getTeammate } from '@/entities/Team/model/selectors/teamSelectors';
import { fetchTeamList } from '@/entities/Team/model/services/fetchTeamList/fetchTeamList';
import Box from '@mui/system/Box';
import { useGetAdditionalTeamData } from '@/entities/Team/api/teamTasksApi';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { LastWeekTable } from '../TeamResults/LastWeekResults/LastWeekTable';
import { CurrentWeekResultTable } from '../TeamResults/CurrentWeekResult/CurrentWeekResultTable';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router-dom';
import { AppRoutes, RoutePath } from '@/shared/config/routeConfig/routeConfig';

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

export const TablesBox = memo(() => {
  const user = useSelector(getUserData);
  let teamList = useSelector(getTeamList);
  const teammate = useSelector(getTeammate);
  const teamIsLoading = useSelector(getTeamIsLoading);
  const dispatch = useAppDispatch();
  const [tabNumber, setTabNumber] = useState(0);
  const location = useLocation();

  const isAccountManagersRoute = location.pathname === RoutePath[AppRoutes.ACCOUNT_MANAGERS];
  const { data: additionalTeamData } = useGetAdditionalTeamData(isAccountManagersRoute ? 'account' : 'inbound');

  if (isAccountManagersRoute) {
    teamList = teamList.filter((user) => user.isAccountManager);
  } else {
    teamList = teamList.filter((user) => !user.isAccountManager);
  }

  const userOnRightPage = user?.isAccountManager === isAccountManagersRoute;
  const shouldSeeUserTable = !teamIsLoading && teammate && userOnRightPage;

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
      dispatch(checkUser());
      const dataFromSocket = JSON.parse(event.data);
      const { userId, updatedAt, isWorkingRemotely } = dataFromSocket;

      if ('statusId' in dataFromSocket && user) {
        const { statusId, status } = dataFromSocket;
        dispatch(
          teamActions.setTeamLocal({
            userId,
            statusId,
            status,
            isWorkingRemotely,
            updatedAt,
          }),
        );
        dispatch(statusActions.changeStatus(user.statusId));
      }

      if ('commentId' in dataFromSocket && user) {
        const { commentId, comment } = dataFromSocket;
        if (comment) {
          dispatch(
            teamActions.setTeamLocal({
              userId,
              commentId,
              comment,
              isWorkingRemotely,
              updatedAt,
            }),
          );
        } else if (commentId === null) {
          dispatch(
            teamActions.setTeamLocal({
              userId,
              comment: null,
              isWorkingRemotely,
              updatedAt,
            }),
          );
        } else {
          dispatch(fetchTeamList());
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
    dispatch(fetchAllComments());
  }, [dispatch]);

  return (
    <DynamicModuleLoader reducers={reducers}>
      {shouldSeeUserTable && (
        <Grid xs={12}>
          <UserTable
            teammate={teammate}
            mango={mango}
            tasks={tasks}
            tickets={tickets}
            teamIsLoading={teamIsLoading}
            avatarsAndBirthday={avatarsAndBirthday}
          />
        </Grid>
      )}
      <Grid xs={12}>
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
            />
          </CustomTabPanel>
          <CustomTabPanel value={tabNumber} index={1}>
            <Box display={'flex'} gap={2}>
              <CurrentWeekResultTable
                teamList={teamList}
                teamIsLoading={teamIsLoading}
                tasks={tasks}
                avatarsAndBirthday={avatarsAndBirthday}
              />
              <LastWeekTable
                teamList={teamList}
                teamIsLoading={teamIsLoading}
                tasks={tasks}
                lastWeekStats={lastWeekStat}
              />
            </Box>
          </CustomTabPanel>
        </Box>
      </Grid>
    </DynamicModuleLoader>
  );
});
