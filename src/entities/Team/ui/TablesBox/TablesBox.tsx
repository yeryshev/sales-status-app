import { Grid, Link as MuiLink, Paper } from '@mui/material';
import { TeamTable } from '../TeamTable/TeamTable';
import { useSelector } from 'react-redux';
import { memo, useCallback, useEffect } from 'react';
import { UserTable } from '../UserTable/UserTable';
import { checkUser, getUserData } from '@/entities/User';
import { teamActions, teamReducer } from '../../model/slice/teamSlice';
import { statusActions } from '@/entities/Status';
import { useAppDispatch } from '@/shared/lib/hooks/AppDispatch';
import { fetchAllComments, getAllComments } from '@/entities/Comment';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { getTeamIsLoading, getTeamList, getTeammate } from '../../model/selectors/teamSelectors';
import { fetchTeamList } from '../../model/services/fetchTeamList/fetchTeamList';
import Box from '@mui/system/Box';
import { Link as RouterLink } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig';
import { useGetAdditionalTeamData } from '../../api/teamTasksApi';

const statusesMapping: Record<number, string> = {
  1: 'online',
  2: 'busy',
  3: 'offline',
};

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
  const teamList = useSelector(getTeamList);
  const teammate = useSelector(getTeammate);
  const teamIsLoading = useSelector(getTeamIsLoading);
  const allComments = useSelector(getAllComments);
  const { data: additionalTeamData } = useGetAdditionalTeamData();
  const dispatch = useAppDispatch();
  const { tasks = {}, tickets = {}, mango = {}, vacation = {} } = additionalTeamData || {};

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
        const { statusId } = dataFromSocket;
        dispatch(
          teamActions.setTeamLocal({
            userId,
            status: statusesMapping[statusId],
            updatedAt,
            isWorkingRemotely,
          }),
        );
        dispatch(statusActions.changeStatus(user.statusId));
      }

      if ('commentId' in dataFromSocket && user) {
        const { commentId } = dataFromSocket;
        const comment = allComments.find((comment) => comment.id === Number(commentId));
        if (comment) {
          dispatch(
            teamActions.setTeamLocal({
              userId,
              comment: comment.description,
              updatedAt,
              isWorkingRemotely,
            }),
          );
        } else if (commentId === null) {
          dispatch(
            teamActions.setTeamLocal({
              userId,
              comment: null,
              updatedAt,
              isWorkingRemotely,
            }),
          );
        } else {
          dispatch(fetchTeamList());
        }
      }
    },
    [dispatch, user, allComments],
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
      {!teamIsLoading && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            {teammate ? (
              <UserTable
                teammate={teammate}
                mango={mango}
                tasks={tasks}
                tickets={tickets}
                teamIsLoading={teamIsLoading}
              />
            ) : (
              <Box>
                Чтобы принять участие, необходимо указать имя и фамилию в{' '}
                <MuiLink component={RouterLink} to={RoutePath.profile}>
                  {'профиле'}
                </MuiLink>
              </Box>
            )}
          </Paper>
        </Grid>
      )}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <TeamTable
            teamList={teamList}
            teamIsLoading={teamIsLoading}
            mango={mango}
            tasks={tasks}
            tickets={tickets}
            vacationStates={vacation}
          />
        </Paper>
      </Grid>
    </DynamicModuleLoader>
  );
});
