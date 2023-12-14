import { useSocketCtx } from '../../../helpers/contexts/wsContext';
import { RootState, useAppDispatch } from '../../../redux/store';
import { useSelector } from 'react-redux';
import { checkUser, updateUser } from '../../../features/user/actions/userActions';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { ChangeEvent, useCallback, useEffect } from 'react';
import { setAllComments } from '../../../features/comments/actions/commentsActions';
import { changeStatus } from '../../../features/statuses/slice/statusSlice';
import { setTeamLocal } from '../../../features/team/slice/teamSlice';
import { setTeam } from '../../../features/team/actions/teamActions';
import { Grid } from '@mui/material';

const Statuses: Record<number, string> = {
  1: 'online',
  2: 'busy',
  3: 'offline',
};

export default function StatusBox() {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useAppDispatch();
  const { socket } = useSocketCtx();
  const status = useSelector((state: RootState) => state.status.value);
  const allComments = useSelector((state: RootState) => state.comments.fullList);

  useEffect(() => {
    if (user?.id) {
      dispatch(setAllComments());
      dispatch(changeStatus(user.statusId));
    }
  }, [dispatch, user?.id, user?.statusId, socket]);

  const handleStatusChange = useCallback(
    (event: MessageEvent) => {
      dispatch(checkUser());
      const dataFromSocket = JSON.parse(event.data);
      const { userId, updatedAt, isWorkingRemotely } = dataFromSocket;

      if ('statusId' in dataFromSocket && user) {
        const { statusId } = dataFromSocket;
        dispatch(setTeamLocal({ userId, status: Statuses[statusId], updatedAt, isWorkingRemotely }));
        dispatch(changeStatus(user.statusId));
      }

      if ('commentId' in dataFromSocket && user) {
        const { commentId } = dataFromSocket;
        const comment = allComments.find((comment) => comment.id === Number(commentId));
        if (comment) {
          dispatch(
            setTeamLocal({ userId, comment: comment.description, updatedAt, isWorkingRemotely })
          );
        } else if (commentId === null) {
          dispatch(setTeamLocal({ userId, comment: null, updatedAt, isWorkingRemotely }));
        } else {
          dispatch(setTeam());
        }
      }
    },
    [dispatch, user, allComments]
  );

  useEffect(() => {
    socket.addEventListener('message', handleStatusChange);

    return () => {
      socket.removeEventListener('message', handleStatusChange);
    };
  }, [socket, handleStatusChange]);

  const handleChangeMainStatus = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const statusId = Number(event.target.value);
    if (user) {
      dispatch(updateUser({ ...user, statusId }));
      // .then(() => {
      //   socket.send(JSON.stringify({ userId: user.id, statusId }));
      // });
    }
  };

  return (
    <>
      <FormLabel id="main-radio-label" sx={{ mb: 2 }}>
        Мой статус
      </FormLabel>
      <RadioGroup
        aria-labelledby="main-radio-label"
        value={status}
        name="main-status-radio"
        onChange={handleChangeMainStatus}
        sx={{ height: '100%' }}
      >
        <Grid container direction="row" spacing={1}>
          <Grid item xs={12} sm={12}>
            <FormControlLabel value={1} control={<Radio />} label="Онлайн" />
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControlLabel value={2} control={<Radio />} label="Занят" />
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControlLabel value={3} control={<Radio />} label="Оффлайн" />
          </Grid>
        </Grid>
      </RadioGroup>
    </>
  );
}
