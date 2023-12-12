import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import Title from '../../PlannerPage/Title';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../redux/store';
import { useEffect } from 'react';
import { setTeam } from '../../../features/team/actions/teamActions';
import Row from './Row/TeamRow';
import { Teammate } from '../../../types/Team';

export default function TeamTable({ team }: { team: Teammate[] }) {
  // const team = useSelector((state: RootState) => state.team.list);
  // const dispatch = useAppDispatch();

  // useEffect(() => {
  //   dispatch(setTeam());
  // }, [dispatch]);

  return (
    <>
      <Title>Мои коллеги</Title>
      <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableBody>
            {team
              .filter((teammate) => teammate.secondName)
              .map((teammate) => (
                <Row key={teammate.id} teammate={teammate} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
