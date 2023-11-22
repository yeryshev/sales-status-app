import { useSocketCtx } from '../../../helpers/contexts/wsContext';
import { RootState, useAppDispatch } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { checkUser, updateUser } from '../../../features/user/actions/userActions';
import { setTeam } from '../../../features/team/actions/teamActions';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { ChangeEvent, useEffect } from 'react';
import { setComments } from '../../../features/comments/actions/commentsActions';
import { changeStatus } from '../../../features/statuses/slice/statusSlice';

export default function StatusBox() {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useAppDispatch();
  const { socket } = useSocketCtx();
  const status = useSelector((state: RootState) => state.status.value);

  useEffect(() => {
    if (user?.id) {
      dispatch(setComments());
      dispatch(changeStatus(user.statusId));
    }
  }, [dispatch, user?.id, user?.statusId]);

  useEffect(() => {
    const handleStatusChange = () => {
      dispatch(checkUser());
      dispatch(setTeam());
      dispatch(changeStatus(user?.statusId));
    };

    socket.addEventListener('message', handleStatusChange);

    return () => {
      socket.removeEventListener('message', handleStatusChange);
    };
  }, [socket, dispatch, user?.statusId]);

  const handleChangeMainStatus = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const statusId = Number(event.target.value);
    if (user) {
      dispatch(updateUser({ ...user, statusId })).then(() => {
        socket.send(JSON.stringify({ userId: user.id, statusId }));
      });
    }
  };

  return (
    <FormControl
      sx={{
        gap: 3,
      }}
    >
      <FormLabel id="main-radio-label">Мой статус</FormLabel>
      <RadioGroup
        aria-labelledby="main-radio-label"
        value={status}
        name="main-status-radio"
        onChange={handleChangeMainStatus}
      >
        <FormControlLabel value={1} control={<Radio />} label="На связи" />
        <FormControlLabel value={2} control={<Radio />} label="Занят" />
        <FormControlLabel value={3} control={<Radio />} label="Недоступен" />
      </RadioGroup>
    </FormControl>
  );
}
