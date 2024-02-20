import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { Teammate } from '../../../../app/types/Team';
import Row from '../Row/Row';
import { MangoRedisData } from '../../../../app/types/Mango';

const UserTable = ({ teammate, mango }: { teammate: Teammate; mango: MangoRedisData }) => {
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
};

export default UserTable;
