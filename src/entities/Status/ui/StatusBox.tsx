import { useSocketCtx } from '../../../app/providers/WsProvider/lib/WsContext';
import { useSelector } from 'react-redux';
import { updateUser } from '../../user/model/actions/userActions';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { type ChangeEvent, useEffect } from 'react';
import { setAllComments } from '../../comments/model/actions/commentsActions';
import { statusActions } from '@/entities/Status/model/slice/statusSlice';
import { Grid } from '@mui/material';
import { useAppDispatch } from '@/app/providers/StoreProvider/config/store';
import { getStatusValue } from '@/entities/Status/model/selectors/getStatusValue/getStatusValue';
import { RootState } from '@/app/providers/StoreProvider';

export const StatusBox = () => {
    const user = useSelector((state: RootState) => state.user.user);
    const dispatch = useAppDispatch();
    const { socket } = useSocketCtx();
    const status = useSelector(getStatusValue);

    useEffect(() => {
        if (user?.id) {
            dispatch(setAllComments());
            dispatch(statusActions.changeStatus(user.statusId));
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
                    data-testid="status-radio-group"
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
};
