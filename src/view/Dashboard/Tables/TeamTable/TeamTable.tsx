import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import Title from '../../../PlannerPage/Title';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import Row from '../Row/Row';
import { useSocketCtx } from '../../../../helpers/contexts/wsContext';
import { useCallback, useEffect, useState } from 'react';
import { MangoRedisData, MangoWsData } from '../../../../types/Mango';

export default function TeamTable() {
  const team = useSelector((state: RootState) => state.team.list);
  const userdId = useSelector((state: RootState) => state.user.user?.id);
  const { mangoSocket } = useSocketCtx();
  const [mango, setMango] = useState<MangoRedisData>({});

  const handleMangoChange = useCallback((event: MessageEvent) => {
    const dataFromSocket: MangoWsData = JSON.parse(event.data);
    if (dataFromSocket.type === 'mango') {
      const key = Object.keys(dataFromSocket.data)[0];
      setMango((prev) => ({ ...prev, [key]: dataFromSocket.data[key] }));
    }
  }, []);

  // useEffect(() => {
  //   fetch(import.meta.env.VITE_MANGO_REDIS_URL, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //     .then((res) => {
  //       console.log(res);
  //       res.json();
  //     })
  //     .then((data) => {
  //       console.log(data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching data:', error);
  //     });
  // }, []);

  useEffect(() => {
    mangoSocket.addEventListener('message', handleMangoChange);

    return () => {
      mangoSocket.removeEventListener('message', handleMangoChange);
    };
  }, [mangoSocket, handleMangoChange]);

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
                <Row
                  key={teammate.id}
                  teammate={teammate}
                  expanded={true}
                  mango={
                    teammate.extNumber === String(Object.keys(mango)[0]) &&
                    mango[Number(teammate.extNumber)]
                  }
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
