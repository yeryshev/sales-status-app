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
                        <TableCell align="left">Комментарий</TableCell>
                        <TableCell align="center">Первичка Просрочка</TableCell>
                        <TableCell align="center">Чаты Тикеты</TableCell>
                        <TableCell align="center">Удалёнка</TableCell>
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
