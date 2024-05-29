import { memo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/shared/lib/hooks/AppDispatch';
import { useGetStatuses } from '@/entities/Status/api/statusApi';
import { getUserData } from '@/entities/User';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { statusActions } from '@/entities/Status';
import { updateUser } from '@/entities/User/model/actions/userActions';
import { FormHelperText } from '@mui/material';
import { getStatusSelectItem } from '../model/selectors/selectStatusSelectors';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { statusSelectorReducer } from '../model/slices/statusSelectorSlice';

const reducers: ReducersList = {
  selectStatus: statusSelectorReducer,
};

export const StatusSelector = memo(() => {
  const user = useSelector(getUserData);
  const dispatch = useAppDispatch();
  const { data: statuses } = useGetStatuses();
  const status = useSelector(getStatusSelectItem);

  useEffect(() => {
    user && dispatch(statusActions.changeStatus(user.statusId));
  }, [dispatch, user]);

  const handleChangeMainStatus = (event: SelectChangeEvent) => {
    const statusId = Number(event.target.value);
    user && dispatch(updateUser({ ...user, statusId }));
  };

  return (
    <DynamicModuleLoader reducers={reducers}>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="demo-simple-select-label" size={'small'}>
          {'Статус'}
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select-vadim"
          value={status ? String(status.id) : ''}
          onChange={handleChangeMainStatus}
          label={'Статус'}
          size={'small'}
        >
          {statuses?.map((status) => (
            <MenuItem key={status.id} value={status.id} disabled={user?.statusId === status.id}>
              {status.title}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{'до 15:00'}</FormHelperText>
      </FormControl>
    </DynamicModuleLoader>
  );
});
