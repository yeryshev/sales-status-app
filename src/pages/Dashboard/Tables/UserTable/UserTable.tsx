import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { type MangoRedisData } from '@/app/types/Mango';
import { Teammate } from '@/entities/Teammate';
import Row from '../Row/Row';
import { memo } from 'react';
import { UsersTasks, UsersTickets } from '@/app/types/Tasks';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import HourglassBottomOutlinedIcon from '@mui/icons-material/HourglassBottomOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { Tooltip } from '@mui/material';

const UserTable = memo((
    {
        teammate,
        mango,
        tasks,
        tickets,
    }: {
        teammate: Teammate;
        mango: MangoRedisData;
        tasks: UsersTasks;
        tickets: UsersTickets;
    },
) => {
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
                    <Row
                        key={teammate.id}
                        teammate={teammate}
                        expanded={false}
                        mango={mango[teammate.extNumber]}
                        tasks={tasks[teammate.insideId]}
                        tickets={tickets[teammate.insideId]}
                    />
                </TableBody>
            </Table>
        </TableContainer>
    );
});

export default UserTable;
