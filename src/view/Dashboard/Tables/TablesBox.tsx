import { Grid, Paper } from '@mui/material';
import TeamTable from './TeamTable/TeamTable';
import { useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { setTeam } from '../../../features/team/actions/teamActions';
import { RootState, useAppDispatch } from '../../../redux/store';
import UserTable from './UserTable/UserTable';
import { useSocketCtx } from '../../../helpers/contexts/wsContext';
import { MangoRedisData, MangoWsData } from '../../../types/Mango';

const TablesBox = () => {
  const team = useSelector((state: RootState) => state.team.list);
  const userId = useSelector((state: RootState) => state.user.user?.id);
  const teammate = team.find((t) => t.id === userId && t.secondName && t.firstName);
  const dispatch = useAppDispatch();
  const { mangoSocket } = useSocketCtx();
  const [mango, setMango] = useState<MangoRedisData>({});

  const handleMangoChange = useCallback((event: MessageEvent) => {
    const dataFromSocket: MangoWsData = JSON.parse(event.data);
    if (dataFromSocket.type === 'mango') {
      const key = Object.keys(dataFromSocket.data)[0];
      setMango((prev) => ({ ...prev, [key]: dataFromSocket.data[key] }));
    }
  }, []);

  useEffect(() => {
    fetch(import.meta.env.VITE_MANGO_REDIS_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setMango(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    mangoSocket.addEventListener('message', handleMangoChange);

    return () => {
      mangoSocket.removeEventListener('message', handleMangoChange);
    };
  }, [mangoSocket, handleMangoChange]);

  useEffect(() => {
    dispatch(setTeam());
  }, [dispatch]);

  return (
    <>
      {teammate && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <UserTable teammate={teammate} mango={mango} />
          </Paper>
        </Grid>
      )}
      {team && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <TeamTable mango={mango} />
          </Paper>
        </Grid>
      )}
    </>
  );
};

export default TablesBox;
