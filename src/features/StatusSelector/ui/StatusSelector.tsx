import { memo, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/shared/lib/hooks/AppDispatch';
import { useGetStatuses } from '@/entities/Status/api/statusApi';
import { getUserData } from '@/entities/User';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { statusActions } from '@/entities/Status';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { statusSelectorReducer } from '../model/slices/statusSelectorSlice';
import { updateUser } from '@/entities/User/model/actions/userActions';

const reducers: ReducersList = {
  selectStatus: statusSelectorReducer,
};

export const StatusSelector = memo(() => {
  const user = useSelector(getUserData);
  const dispatch = useAppDispatch();
  const { data: statuses } = useGetStatuses();
  // const status = useSelector(getStatusSelectItem);

  const cachedStatuses = useMemo(() => statuses, [statuses]);
  const cachedUserStatus = useMemo(() => user?.statusId, [user?.statusId]);

  const userStatus = useMemo(
    () => cachedStatuses?.find((status) => status.id === cachedUserStatus),
    [cachedStatuses, cachedUserStatus],
  );

  useEffect(() => {
    user && dispatch(statusActions.changeStatus(user.statusId));
  }, [dispatch, user]);

  const handleChangeMainStatus = (_: SelectChangeEvent, child: unknown) => {
    // @ts-expect-error ts(2339)
    const statusId = Number(child.key.slice(-1) || cachedUserStatus);
    user && dispatch(updateUser({ ...user, statusId }));
  };

  return (
    <DynamicModuleLoader reducers={reducers}>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="select-status-form-label" size={'small'}>
          {'Статус'}
        </InputLabel>
        <Select
          labelId="select-status-form-label"
          id="select-status-form"
          value={userStatus?.title || ''}
          onChange={handleChangeMainStatus}
          label={'Статус'}
          size={'small'}
        >
          {cachedStatuses?.map((status) => (
            <MenuItem key={status.id} value={status.title} disabled={user?.statusId === status.id}>
              {status.title}
            </MenuItem>
          ))}
        </Select>
        {/*<FormHelperText>{'до 15:00'}</FormHelperText>*/}
      </FormControl>
    </DynamicModuleLoader>
  );
});
