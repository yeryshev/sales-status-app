import Paper from '@mui/material/Paper';
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

const UserTable = memo(({ teammate, mango }: { teammate: Teammate; mango: MangoRedisData }) => {
    return (
        <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell align="left">Имя</TableCell>
                        <TableCell align="left">Статус</TableCell>
                        <TableCell align="left">Комментарий</TableCell>
                        <TableCell align="right">Удалёнка</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <Row
                        key={teammate.id}
                        teammate={teammate}
                        expanded={false}
                        mango={mango[teammate.extNumber]}
                    />
                </TableBody>
            </Table>
        </TableContainer>
    );
});

export default UserTable;
