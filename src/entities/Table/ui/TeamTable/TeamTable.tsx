import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { useSelector } from 'react-redux';
import { type StateSchema } from '@/app/providers/StoreProvider';
import { Row } from '../Row/Row';
import LinearProgress from '@mui/material/LinearProgress';
import { memo } from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import HourglassBottomOutlinedIcon from '@mui/icons-material/HourglassBottomOutlined';
import { Tooltip } from '@mui/material';
import { MangoRedisData, UsersTasks, UsersTickets } from '@/entities/Table/model/types/tasksWebsocket';

export const TeamTable = memo((
    {
        mango,
        tasks,
        tickets,
    }: {
        mango: MangoRedisData,
        tasks: UsersTasks,
        tickets: UsersTickets
    },
) => {
    const team = useSelector((state: StateSchema) => state.team.list);
    const teamLoading = useSelector((state: StateSchema) => state.team.loading);
    const userId = useSelector((state: StateSchema) => state.user.user?.id);

    return (
        <>
            {teamLoading ? (
                <LinearProgress />
            ) : (
                <TableContainer style={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell align="left"></TableCell>
                                <TableCell align="left"></TableCell>
                                <TableCell align="left"></TableCell>
                                <Tooltip title={'Первичные обращения'}>
                                    <TableCell align="center"><RequestQuoteOutlinedIcon fontSize={'small'} /></TableCell>
                                </Tooltip>
                                <Tooltip title={'Просроченные задачи'}>
                                    <TableCell align="center"><HourglassBottomOutlinedIcon fontSize={'small'} /></TableCell>
                                </Tooltip>
                                <Tooltip title={'Количество открытых чатов'}>
                                    <TableCell align="center"><QuestionAnswerOutlinedIcon fontSize={'small'}/></TableCell>
                                </Tooltip>
                                <Tooltip title={'Назначенные тикеты'}>
                                    <TableCell align="center"><FeedbackOutlinedIcon fontSize={'small'}/></TableCell>
                                </Tooltip>
                                <TableCell align="center"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {team
                                .filter(
                                    (teammate) =>
                                        teammate.secondName &&
                                        teammate.firstName &&
                                        teammate.id !== userId,
                                )
                                .map((teammate) => (
                                    <Row
                                        key={teammate.id}
                                        teammate={teammate}
                                        expanded={true}
                                        mango={mango[teammate.extNumber]}
                                        tasks={tasks[teammate.insideId]}
                                        tickets={tickets[teammate.insideId]}
                                    />
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </>
    );
});