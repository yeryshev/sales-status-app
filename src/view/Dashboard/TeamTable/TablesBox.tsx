import {
  Grid,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import Row from './Row/TeamRow';
import TeamTable from './TeamTable';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setTeam } from '../../../features/team/actions/teamActions';
import { RootState, useAppDispatch } from '../../../redux/store';

const TablesBox = () => {
  const team = useSelector((state: RootState) => state.team.list);
  const teamLoading = useSelector((state: RootState) => state.team.loading);
  const userId = useSelector((state: RootState) => state.user.user?.id);
  const teammate = team.find((t) => t.id === userId);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setTeam());
  }, [dispatch]);

  return (
    <>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
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
                {teammate ? <Row key={teammate.id} teammate={teammate} /> : <div>Загрузка</div>}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          {teamLoading ? <div>Загрузка</div> : <TeamTable />}
        </Paper>
      </Grid>
    </>
  );
};

export default TablesBox;
