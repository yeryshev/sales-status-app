import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import Title from './Title';
import { useSelector } from 'react-redux';
import { type StateSchema } from '@/app/providers/StoreProvider';
import Row from '../Row/Row';
import { type MangoRedisData } from '@/app/types/Mango';
import LinearProgress from '@mui/material/LinearProgress';
import { memo } from 'react';
import { UsersTasks } from '@/app/types/Tasks';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

const TeamTable = memo((
    {
        mango,
        tasks,
    }: {
        mango: MangoRedisData,
        tasks: UsersTasks,
    },
) => {
    const team = useSelector((state: StateSchema) => state.team.list);
    const teamLoading = useSelector((state: StateSchema) => state.team.loading);
    const userId = useSelector((state: StateSchema) => state.user.user?.id);

    return (
        <>
            <Title>Мои коллеги</Title>
            {teamLoading ? (
                <LinearProgress />
            ) : (
                <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell align="left"></TableCell>
                                <TableCell align="left"></TableCell>
                                <TableCell align="left"></TableCell>
                                <TableCell align="center">Первичка</TableCell>
                                <TableCell align="center">Просрочка</TableCell>
                                <TableCell align="center">Чаты</TableCell>
                                <TableCell align="right"></TableCell>
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
                                    />
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </>
    );
});

export default TeamTable;
