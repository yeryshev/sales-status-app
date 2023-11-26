import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useCallback, useEffect, useState } from 'react';
import { useSocketCtx } from '../../../helpers/contexts/wsContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';

const WsAlert = () => {
  const { socket } = useSocketCtx();
  const [open, setOpen] = useState(false);
  const team = useSelector((state: RootState) => state.team.list);
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning'>('success');
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState<'на месте' | 'занят' | 'недоступен'>('недоступен');
  const userId = useSelector((state: RootState) => state.user.user?.id);

  const handleStatusChange = useCallback(
    (arg: MessageEvent) => {
      const data = JSON.parse(arg.data);
      if (data.userId === userId || !data.statusId) return;
      const teammateName = team.find((t) => t.id === data.userId)?.firstName;
      const teammateSurname = team.find((t) => t.id === data.userId)?.secondName;
      if (!teammateName || !teammateSurname) return;

      switch (data.statusId) {
        case 1:
          setAlertType('success');
          setMessage('на месте');
          break;
        case 2:
          setAlertType('warning');
          setMessage('занят');
          break;
        case 3:
          setAlertType('error');
          setMessage('недоступен');
          break;
        default:
          setAlertType('success');
      }

      setUserName(`${teammateName} ${teammateSurname}`);
      setOpen(true);
    },
    [team, userId]
  );

  useEffect(() => {
    socket.addEventListener('message', handleStatusChange);

    return () => {
      socket.removeEventListener('message', handleStatusChange);
    };
  }, [handleStatusChange, socket]);

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setOpen(false)} severity={alertType}>
          {`${userName} ${message}`}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default WsAlert;
