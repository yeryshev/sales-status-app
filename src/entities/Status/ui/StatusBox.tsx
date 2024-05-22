import { useSelector } from 'react-redux';
import { updateUser } from '@/entities/User/model/actions/userActions';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Unstable_Grid2';
import { type ChangeEvent, useEffect } from 'react';
import { statusActions } from '../model/slice/statusSlice';
import { useAppDispatch } from '@/shared/lib/hooks/AppDispatch';
import { getStatusValue } from '../model/selectors/getStatusValue/getStatusValue';
import { StateSchema } from '@/app/providers/StoreProvider';

export const StatusBox = () => {
  const user = useSelector((state: StateSchema) => state.user.user);
  const dispatch = useAppDispatch();
  const status = useSelector(getStatusValue);

  useEffect(() => {
    user && dispatch(statusActions.changeStatus(user.statusId));
  }, [dispatch, user]);

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
          data-testid="status-radio-group"
        >
          <Grid container direction="row" spacing={1}>
            <Grid xs={12} sm={12}>
              <FormControlLabel value={1} control={<Radio />} label="Онлайн" />
            </Grid>
            <Grid xs={12} sm={12}>
              <FormControlLabel value={2} control={<Radio />} label="Занят" />
            </Grid>
            <Grid xs={12} sm={12}>
              <FormControlLabel value={3} control={<Radio />} label="Оффлайн" />
            </Grid>
          </Grid>
        </RadioGroup>
      </FormLabel>
    </>
  );
};
