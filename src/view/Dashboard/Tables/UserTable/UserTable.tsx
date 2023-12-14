import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { Teammate } from '../../../../types/Team';
import Row from '../Row/Row';

const UserTable = ({ teammate }: { teammate: Teammate }) => {
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
          <Row key={teammate.id} teammate={teammate} expanded={false} />
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
