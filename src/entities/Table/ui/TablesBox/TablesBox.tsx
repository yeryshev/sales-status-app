import { Grid, Link as MuiLink, Paper } from '@mui/material';
import { TeamTable } from '../TeamTable/TeamTable';
import { useSelector } from 'react-redux';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { setTeam } from '@/entities/Teammate/model/actions/teamActions';
import { UserTable } from '../UserTable/UserTable';
import { useSocketCtx } from '@/app/providers/WsProvider/lib/WsContext';
import { type MangoRedisData } from '@/app/types/Mango';
import { Link as RouterLink } from 'react-router-dom';
import { checkUser } from '@/entities/User/model/actions/userActions';
import { setTeamLocal } from '@/entities/Teammate/model/slice/teamSlice';
import { statusActions } from '@/entities/Status/model/slice/statusSlice';
import { useAppDispatch } from '@/shared/lib/hooks/AppDispatch';
import { StateSchema } from '@/app/providers/StoreProvider';
import { UsersTasks, UsersTickets } from '@/app/types/Tasks';
import { fetchAllComments, getAllComments } from '@/entities/Comment';
import Box from '@mui/material/Box';
import { RoutePath } from '@/shared/config/routeConfig/routeConfig';

const Statuses: Record<number, string> = {
    1: 'online',
    2: 'busy',
    3: 'offline',
};

export const TablesBox = memo(() => {
    const user = useSelector((state: StateSchema) => state.user.user);
    const team = useSelector((state: StateSchema) => state.team.list);
    const teamLoading = useSelector((state: StateSchema) => state.team.loading);
    const userId = useSelector((state: StateSchema) => state.user.user?.id);
    const teammate = team.find((t) => t.id === userId && t.secondName && t.firstName);
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
                    dispatch(setTeam());
                }
            }
        },
        [dispatch, user, allComments],
    );

    const handleTasksChange = useCallback((event: MessageEvent) => {
        const dataFromSocket = JSON.parse(event.data);

        if (dataFromSocket.type === 'mango') {
            const key = Object.keys(dataFromSocket.data)[0];
            setMango((prev) => ({ ...prev, [key]: dataFromSocket.data[key] }));
        }
        if (dataFromSocket.type === 'tasks') {
            setTasks(dataFromSocket.data);
        }
        if (dataFromSocket.type === 'tickets') {
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
        dispatch(setTeam());
        dispatch(fetchAllComments());
    }, [dispatch]);

    return (
        <>
            <Grid item xs={12}>
                {!teamLoading && (
                    <Paper sx={{ p: 2 }}>
                        {teammate ? (
                            <UserTable
                                teammate={teammate}
                                mango={mango}
                                tasks={tasks}
                                tickets={tickets}
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
                )}
            </Grid>
            {team && (
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <TeamTable
                            mango={mango}
                            tasks={tasks}
                            tickets={tickets}
                        />
                    </Paper>
                </Grid>
            )}
        </>
    );
});