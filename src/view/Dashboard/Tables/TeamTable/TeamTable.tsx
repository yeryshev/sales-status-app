import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import Title from '../../../PlannerPage/Title';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import Row from '../Row/Row';

export default function TeamTable() {
  const team = useSelector((state: RootState) => state.team.list);
  const userdId = useSelector((state: RootState) => state.user.user?.id);

  return (
    <>
      <Title>Мои коллеги</Title>
      <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableBody>
            {team
              .filter(
                (teammate) => teammate.secondName && teammate.firstName && teammate.id !== userdId
              )
              .map((teammate) => (
                <Row key={teammate.id} teammate={teammate} expanded={true} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
