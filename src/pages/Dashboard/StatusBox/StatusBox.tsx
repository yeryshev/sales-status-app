import { useSocketCtx } from '../../../app/providers/WsProvider/lib/WsContext';
import { RootState, useAppDispatch } from '../../../app/redux/store';
import { useSelector } from 'react-redux';
import { updateUser } from '../../../features/user/actions/userActions';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { ChangeEvent, useEffect } from 'react';
import { setAllComments } from '../../../features/comments/actions/commentsActions';
import { changeStatus } from '../../../features/statuses/slice/statusSlice';
import { Grid } from '@mui/material';

export default function StatusBox() {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useAppDispatch();
  const { socket } = useSocketCtx();
  const status = useSelector((state: RootState) => state.status.value);

  useEffect(() => {
    if (user?.id) {
      dispatch(setAllComments());
      dispatch(changeStatus(user.statusId));
    }
  }, [dispatch, user?.id, user?.statusId, socket]);

  const handleChangeMainStatus = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const statusId = Number(event.target.value);
    if (user) {
      dispatch(updateUser({ ...user, statusId }));
    }
  };

  return (
    <>
      <FormLabel id="main-radio-label">
        Мой статус
        <RadioGroup
          aria-labelledby="main-radio-label"
          value={status}
          name="main-status-radio"
          onChange={handleChangeMainStatus}
          sx={{ height: '100%', mt: 1 }}
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
      </FormLabel>
    </>
  );
}
