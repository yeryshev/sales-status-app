import { memo, useEffect, useMemo, useState } from 'react';
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
import { feminizeWord } from '@/shared/lib/feminizeWords/feminizeWords';
import { AwayConfirmationModal } from './AwayConfirmationModal/AwayConfirmationModal';
import { updateUser } from '@/entities/User/model/actions/userActions';
import Typography from '@mui/material/Typography';
import moment from 'moment/moment';

const INTERVAL_MS = 30000;

const checkDeadline = (deadlineTime: number) => {
  const currentTimeUTC = moment().utc().valueOf();
  return currentTimeUTC >= deadlineTime;
};

const reducers: ReducersList = {
  selectStatus: statusSelectorReducer,
};

export const StatusSelector = memo(() => {
  const user = useSelector(getUserData);
  const dispatch = useAppDispatch();
  const { data: statuses } = useGetStatuses();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newStatusId, setNewStatusId] = useState(user?.statusId);
  const deadline = user?.busyTime.endTime;
  const deadlineTimeMsk = moment.utc(deadline).utcOffset('+0300').format('HH:mm');
  const [isDeadlineReached, setIsDeadlineReached] = useState(false);

  useEffect(() => {
    if (!deadline || user?.busyTime.statusId !== user?.statusId) {
      return;
    }

    const deadlineTime = moment.utc(deadline).valueOf();
    const isDeadlineReached = checkDeadline(deadlineTime);
    const intervalId = setInterval(checkDeadline, INTERVAL_MS);

    if (isDeadlineReached) {
      setIsDeadlineReached(true);
      clearInterval(intervalId);
    } else {
      setIsDeadlineReached(false);
    }

    return () => clearInterval(intervalId);
  }, [deadline, user?.busyTime.statusId, user?.statusId]);

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
    // @ts-expect-error ts(2322): Type 'unknown' is not assignable to type 'never'.
    const statusId = Number(child.key.slice(-1) || cachedUserStatus);
    setNewStatusId(statusId);
    const newStatus = cachedStatuses?.find((status) => status.id === statusId);
    if (newStatus?.isDeadlineRequired) {
      setModalIsOpen(true);
    } else {
      user && dispatch(updateUser({ user: { ...user, statusId } }));
    }
  };

  const handleModalClose = (minutes?: number) => {
    setModalIsOpen(false);
    if (minutes && user) {
      const deadline = new Date(Date.now() + minutes * 60000).toISOString();
      dispatch(updateUser({ user: { ...user, statusId: newStatusId || user.statusId }, deadline }));
    }
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
      {userStatus?.isDeadlineRequired && (
        <Typography variant="caption" color={`${isDeadlineReached ? 'error' : 'text.secondary'}`}>
          до {deadlineTimeMsk}
        </Typography>
      )}
      <AwayConfirmationModal id={'away-modal'} open={modalIsOpen} onClose={handleModalClose} />
    </DynamicModuleLoader>
  );
});
