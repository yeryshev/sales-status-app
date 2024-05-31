import { memo, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/shared/lib/hooks/AppDispatch';
import { useGetStatuses } from '@/entities/Status/api/statusApi';
import { getUserData } from '@/entities/User';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { statusActions } from '@/entities/Status';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { statusSelectorReducer } from '../model/slices/statusSelectorSlice';
import { updateUser } from '@/entities/User/model/actions/userActions';
import { feminizeWord } from '@/shared/lib/feminizeWords/feminizeWords';

const reducers: ReducersList = {
  selectStatus: statusSelectorReducer,
};

export const StatusSelector = memo(() => {
  const user = useSelector(getUserData);
  const dispatch = useAppDispatch();
  const { data: statuses } = useGetStatuses();
  // const [modalOpen, setModalOpen] = useState(false);
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
    // const newStatus = cachedStatuses?.find((status) => status.id === statusId);
    // if (newStatus?.isDeadlineRequired) {
    //   setModalOpen(true);
    // }
    user && dispatch(updateUser({ ...user, statusId }));
  };

  return (
    <DynamicModuleLoader reducers={reducers}>
      <FormControl fullWidth>
        <Select value={userStatus?.title || ''} onChange={handleChangeMainStatus} size={'small'} fullWidth>
          {cachedStatuses?.map((status) => (
            <MenuItem key={status.id} value={status.title} disabled={user?.statusId === status.id}>
              {feminizeWord(status.title, user?.isFemale)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/*<AwayConfirmationModal*/}
      {/*  open={modalOpen}*/}
      {/*  value={'Dione'}*/}
      {/*  onClose={() => setModalOpen(false)}*/}
      {/*  id={'ringtone-menu'}*/}
      {/*  keepMounted={false}*/}
      {/*/>*/}
    </DynamicModuleLoader>
  );
});
