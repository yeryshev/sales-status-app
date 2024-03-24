import { Grid, Paper, Link as MuiLink } from '@mui/material';
import TeamTable from './TeamTable/TeamTable';
import { useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { setTeam } from '@/entities/Teammate/model/actions/teamActions';
import UserTable from './UserTable/UserTable';
import { useSocketCtx } from '@/app/providers/WsProvider/lib/WsContext';
import { type MangoRedisData, type MangoWsData } from '@/app/types/Mango';
import { Link as RouterLink } from 'react-router-dom';
import { checkUser } from '@/entities/User/model/actions/userActions';
import { setTeamLocal } from '@/entities/Teammate/model/slice/teamSlice';
import { statusActions } from '@/entities/Status/model/slice/statusSlice';
import { useAppDispatch } from '@/shared/lib/hooks/AppDispatch';
import { StateSchema } from '@/app/providers/StoreProvider';

const Statuses: Record<number, string> = {
    1: 'online',
    2: 'busy',
    3: 'offline',
};

const TablesBox = () => {
    const user = useSelector((state: StateSchema) => state.user.user);
    const team = useSelector((state: StateSchema) => state.team.list);
    const teamLoading = useSelector((state: StateSchema) => state.team.loading);
    const userId = useSelector((state: StateSchema) => state.user.user?.id);
    const teammate = team.find((t) => t.id === userId && t.secondName && t.firstName);
    const allComments = useSelector((state: StateSchema) => state.comments.fullList);
    const dispatch = useAppDispatch();
    const [ socket, mangoSocket, tasksSocket ] = useSocketCtx();
    const [mango, setMango] = useState<MangoRedisData>({});

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

    const handleMangoChange = useCallback((event: MessageEvent) => {
        const dataFromSocket: MangoWsData = JSON.parse(event.data);
        console.log(dataFromSocket);
        if (dataFromSocket.type === 'mango') {
            const key = Object.keys(dataFromSocket.data)[0];
            setMango((prev) => ({ ...prev, [key]: dataFromSocket.data[key] }));
        }
    }, []);

    const handleTasksChange = useCallback((event: MessageEvent) => {
        const dataFromSocket = JSON.parse(event.data);
        console.log(dataFromSocket);
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
        mangoSocket?.addEventListener('message', handleMangoChange);
        tasksSocket?.addEventListener('message', handleTasksChange);

        return () => {
            socket?.removeEventListener('message', handleStatusChange);
            mangoSocket?.removeEventListener('message', handleMangoChange);
            tasksSocket?.removeEventListener('message', handleTasksChange);
        };
    }, [
        socket,
        mangoSocket,
        tasksSocket,
        handleStatusChange, 
        handleMangoChange,
        handleTasksChange,
    ]);

    useEffect(() => {
        dispatch(setTeam());
    }, [dispatch]);

    return (
        <>
            <Grid item xs={12}>
                {!teamLoading && (
                    <Paper sx={{ p: 2 }}>
                        {teammate ? (
                            <UserTable teammate={teammate} mango={mango} />
                        ) : (
                            <div>
                                Чтобы принять участие, необходимо указать имя и фамилию в{' '}
                                <MuiLink component={RouterLink} to="/profile">
                                    {'профиле'}
                                </MuiLink>
                            </div>
                        )}
                    </Paper>
                )}
            </Grid>
            {team && (
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <TeamTable mango={mango} />
                    </Paper>
                </Grid>
            )}
        </>
    );
};

export default TablesBox;
