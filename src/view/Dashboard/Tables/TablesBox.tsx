import { Grid, Paper } from '@mui/material';
import TeamTable from './TeamTable/TeamTable';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setTeam } from '../../../features/team/actions/teamActions';
import { RootState, useAppDispatch } from '../../../redux/store';
import UserTable from './UserTable/UserTable';

const TablesBox = () => {
  const team = useSelector((state: RootState) => state.team.list);
  const userId = useSelector((state: RootState) => state.user.user?.id);
  const teammate = team.find((t) => t.id === userId && t.secondName && t.firstName);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setTeam());
  }, [dispatch]);

  return (
    <>
      {teammate && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <UserTable teammate={teammate} />
          </Paper>
        </Grid>
      )}
      {team && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <TeamTable />
          </Paper>
        </Grid>
      )}
    </>
  );
};

export default TablesBox;
