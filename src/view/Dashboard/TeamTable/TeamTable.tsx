import * as React from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Title from '../../PlannerPage/Title';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../redux/store';
import { useEffect } from 'react';
import { setTeam } from '../../../features/team/actions/teamActions';
import Row from './Row/Row';

export default function TeamTable() {
  const team = useSelector((state: RootState) => state.team.list);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setTeam());
  }, [dispatch]);

  return (
    <React.Fragment>
      <Title>Мои коллеги</Title>
      <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="left">Имя</TableCell>
              <TableCell align="left">Статус</TableCell>
              <TableCell align="left">Комментарий</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {team
              .filter((teammate) => teammate.secondName)
              .map((teammate) => (
                <Row key={teammate.id} teammate={teammate} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}
