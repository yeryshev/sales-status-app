import { useSelector } from 'react-redux';
import { getProfileData } from '../../model/selectors/getProfileData/getProfileData';
// import { getProfileIsLoading } from '@/entities/Profile/model/selectors/getProfileIsLoading/getProfileIsLoading';
// import { getProfileError } from '@/entities/Profile/model/selectors/getProfileError/getProfileError';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

export const ProfileCard = () => {
    const data = useSelector(getProfileData);
    // const isLoading = useSelector(getProfileIsLoading);
    // const error = useSelector(getProfileError);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
                <TextField
                    name={'firstName'}
                    label={'Имя'}
                    value={data?.firstName}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                        style: { zIndex: 1 },
                    }}
                />
                <TextField
                    name={'secondName'}
                    label={'Фамилия'}
                    value={data?.secondName}
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                        style: { zIndex: 1 },
                    }}
                />
            </Grid>
        </Grid>
    );
};