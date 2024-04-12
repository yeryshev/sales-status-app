import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Teammate } from '@/entities/Team';
import { memo } from 'react';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import HourglassBottomOutlinedIcon from '@mui/icons-material/HourglassBottomOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { Tooltip } from '@mui/material';
import { UsersMango, UsersTasks, UsersTickets } from '../../model/types/tasksWebsocket';
import { UserRow } from '@/entities/Team/ui/UserRow/UserRow';
import { RowSkeleton } from '@/entities/Team/ui/RowSkeleton/RowSkeleton';

interface UserTableProps {
  teammate?: Teammate;
  mango: UsersMango;
  tasks: UsersTasks;
  tickets: UsersTickets;
  teamIsLoading: boolean;
}

export const UserTable = memo((props: UserTableProps) => {
    const { teammate, mango, tasks, tickets, teamIsLoading } = props;

    return (
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
                        <Tooltip title={'Работаю из дома'}>
                            <TableCell align="center"><HomeOutlinedIcon fontSize={'small'} /></TableCell>
                        </Tooltip>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {teammate
                        ? <UserRow
                            key={teammate.id}
                            teammate={teammate}
                            mango={mango[teammate.extNumber]}
                            tasks={tasks[teammate.insideId]}
                            tickets={tickets[teammate.insideId]}
                            teamIsLoading={teamIsLoading}
                        />
                        : null}
                    {teamIsLoading && <RowSkeleton />}
                </TableBody>
            </Table>
        </TableContainer>
    );
});