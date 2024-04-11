import { Grid, Link as MuiLink, Paper } from '@mui/material';
import { TeamTable } from '../TeamTable/TeamTable';
import { useSelector } from 'react-redux';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { UserTable } from '../UserTable/UserTable';
import { useSocketCtx } from '@/app/providers/WsProvider/lib/WsContext';
import { checkUser } from '@/entities/User/model/actions/userActions';
import { setTeamLocal, teamReducer } from '../../model/slice/teamSlice';
import { statusActions } from '@/entities/Status/model/slice/statusSlice';
import { useAppDispatch } from '@/shared/lib/hooks/AppDispatch';
import { fetchAllComments, getAllComments } from '@/entities/Comment';
import { MangoRedisData, UsersTasks, UsersTickets, WsTasksData, WsTypes } from '../../model/types/tasksWebsocket';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { getTeamIsLoading, getTeamList, getTeammate } from '../../model/selectors/teamSelectors';
import { fetchTeamList } from '../../model/services/fetchTeamList/fetchTeamList';
import Box from '@mui/system/Box';
import { Link as RouterLink } from 'react-router-dom';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig';
import { getUserData } from '@/entities/User/model/selectors/userSelectors';

const Statuses: Record<number, string> = {
    1: 'online',
    2: 'busy',
    3: 'offline',
};

const reducers: ReducersList = {
    teamTable: teamReducer,
};

export const TablesBox = memo(() => {
    const user = useSelector(getUserData);
    const teamList = useSelector(getTeamList);
    const teammate = useSelector(getTeammate);
    const teamIsLoading = useSelector(getTeamIsLoading);
    const allComments = useSelector(getAllComments);
    const dispatch = useAppDispatch();
    const [ socket ] = useSocketCtx();
    const [ mango, setMango ] = useState<MangoRedisData>({});
    const [ tasks, setTasks ] = useState<UsersTasks>({});
    const [ tickets, setTickets ] = useState<UsersTickets>({});

    const tasksSocket = useMemo(() => {
        return new WebSocket(`${import.meta.env.VITE_TASKS_SOCKET_URL}`);
    }, []);

    const handleStatusChange = useCallback(
        (event: MessageEvent) => {
            dispatch(checkUser());
            const dataFromSocket = JSON.parse(event.data);
            const { userId, updatedAt, isWorkingRemotely } = dataFromSocket;

            if ('statusId' in dataFromSocket && user) {
                const { statusId } = dataFromSocket;
                dispatch(
                    setTeamLocal({
                        userId,
                        status: Statuses[statusId],
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
                        setTeamLocal({
                            userId,
                            comment: comment.description,
                            updatedAt,
                            isWorkingRemotely,
                        }),
                    );
                } else if (commentId === null) {
                    dispatch(setTeamLocal({ userId, comment: null, updatedAt, isWorkingRemotely }));
                } else {
                    dispatch(fetchTeamList());
                }
            }
        },
        [dispatch, user, allComments],
    );

    const handleTasksChange = useCallback((event: MessageEvent) => {
        const dataFromSocket: WsTasksData = JSON.parse(event.data);

        if (dataFromSocket.type === WsTypes.MANGO) {
            const key = Object.keys(dataFromSocket.data)[0];
            setMango((prev) => ({ ...prev, [key]: dataFromSocket.data[key] }));
        }
        if (dataFromSocket.type === WsTypes.TASKS) {
            setTasks(dataFromSocket.data);
        }
        if (dataFromSocket.type === WsTypes.TICKETS) {
            setTickets(dataFromSocket.data);
        }
    }, []);

    useEffect(() => {
        fetch(import.meta.env.VITE_MANGO_REDIS_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(async (res) => {
                return await res.json();
            })
            .then((data) => {
                setMango(data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    useEffect(() => {
        socket?.addEventListener('message', handleStatusChange);
        tasksSocket?.addEventListener('message', handleTasksChange);

        return () => {
            socket?.removeEventListener('message', handleStatusChange);
            tasksSocket?.removeEventListener('message', handleTasksChange);
        };
    }, [
        socket,
        tasksSocket,
        handleStatusChange, 
        handleTasksChange,
    ]);

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
                        mango={mango}
                        tasks={tasks}
                        tickets={tickets}
                        teamIsLoading={teamIsLoading}
                    />
                </Paper>
            </Grid>
        </DynamicModuleLoader>
    );
});