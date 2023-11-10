import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useEffect, useState } from 'react';
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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const handleStatusChange = (arg: MessageEvent) => {
      const data = JSON.parse(arg.data);
      if (data.userId === userId || !data.statusId) return;
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
      setUserName(
        `${team.find((t) => t.id === data.userId)?.firstName} ${
          team.find((t) => t.id === data.userId)?.secondName
        }`
      );
      handleOpen();
    };
    socket.addEventListener('message', handleStatusChange);

    return () => {
      socket.removeEventListener('message', handleStatusChange);
    };
  }, [socket, team, userId]);

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={alertType}>
          {`${userName} ${message}`}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default WsAlert;
