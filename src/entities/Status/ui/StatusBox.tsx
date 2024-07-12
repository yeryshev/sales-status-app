import { useSelector } from 'react-redux';
import { getUserData, updateUser } from '@/entities/User';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Unstable_Grid2';
import { type ChangeEvent, useEffect } from 'react';
import { statusActions } from '../model/slice/statusSlice';
import { useAppDispatch } from '@/shared/lib/hooks/AppDispatch';
import { getStatusData } from '../model/selectors/getStatusValue/getStatusData';
import { useGetStatuses } from '../api/statusApi';
import { Status } from '../model/types/Status';

const mapStatusColors = (status_priority: Status['priority']) => {
  if (status_priority === 0) {
    return 'default';
  }
  if (status_priority === 2) {
    return 'success';
  }
  return 'primary';
};

export const StatusBox = () => {
  const user = useSelector(getUserData);
  const dispatch = useAppDispatch();
  const status = useSelector(getStatusData);
  const { data: statuses } = useGetStatuses();

  useEffect(() => {
    user && dispatch(statusActions.changeStatus(user.statusId));
  }, [dispatch, user]);

  const handleChangeMainStatus = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const statusId = Number(event.target.value);
    if (user) {
      dispatch(updateUser({ user: { ...user, statusId } }));
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
            {statuses &&
              statuses.map((status) => (
                <Grid xs={12} sm={12} key={status.id}>
                  <FormControlLabel
                    value={status.id}
                    control={<Radio color={mapStatusColors(status?.priority)} />}
                    label={status.title}
                  />
                </Grid>
              ))}
          </Grid>
        </RadioGroup>
      </FormLabel>
    </>
  );
};
