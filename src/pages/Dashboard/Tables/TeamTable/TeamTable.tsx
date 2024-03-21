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

const TeamTable = memo(({ mango }: { mango: MangoRedisData }) => {
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
