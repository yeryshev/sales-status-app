import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import { Profile } from '../../model/types/profile';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

interface ProfileCardProps {
  data?: Profile
  isLoading?: boolean
  error?: string
  onChangeFirstName?: (value?: string) => void
  onChangeSecondName?: (value?: string) => void
  onChangeEmail?: (value?: string) => void
  onChangeExtNumber?: (value?: string) => void
  onChangeTelegram?: (value?: string) => void
  onChangePhotoUrl?: (value?: string) => void
  onCancelEdit?: () => void
  onSave?: () => void
}

export const ProfileCard = (props: ProfileCardProps) => {
    const {
        data,
        isLoading,
        error,
        onChangeFirstName,
        onChangeSecondName,
        onChangeEmail,
        onChangeExtNumber,
        onChangeTelegram,
        onChangePhotoUrl,
        onCancelEdit,
        onSave,
    } = props;

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                }}
            >
                <Alert
                    sx={{ width: '100%' }}
                    severity="error"
                >
                    {error}
                </Alert>
            </Box>
        );
    }

    return (
        <Grid container spacing={3} my={4}>
            <Grid xs={12} sm={4} lg={3} className="avatar-column">
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                        justifyContent: 'center',
                        // height: '100%',
                        // marginBottom: (theme) => theme.spacing(2),
                    }}
                >
                    {/*<Grid*/}
                    {/*    container*/}
                    {/*    spacing={4}*/}
                    {/*    display={'flex'}*/}
                    {/*    alignItems="center"*/}
                    {/*    justifyContent="center"*/}
                    {/*>*/}
                    <Box>
                        <Avatar
                            // src={formData.photoUrl}
                            sx={{
                                aspectRatio: '1/1',
                                width: '100%',
                                height: '100%',
                            }}
                            // alt={formData.firstName}
                            className="avatar-container"
                        />
                    </Box>
                    {/*</Grid>*/}
                </Paper>
            </Grid>
            <Grid xs={12} sm={8} lg={9} className="form-column">
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                    }}
                >
                    <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                        <Grid xs={12} sm={12} md={6} lg={6}>
                            <TextField
                                value={data?.firstName}
                                onChange={(e) => onChangeFirstName?.(e.target.value)}
                                name={data?.firstName}
                                label={'Имя'}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                    style: { zIndex: 1 },

                                }}
                            />
                        </Grid>
                        <Grid xs={12} sm={12} md={6} lg={6}>
                            <TextField
                                value={data?.secondName}
                                onChange={(e) => onChangeSecondName?.(e.target.value)}
                                name={data?.secondName}
                                label={'Фамилия'}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                    style: { zIndex: 1 },

                                }}
                            />
                        </Grid><Grid xs={12} sm={12} md={6} lg={6}>
                            <TextField
                                value={data?.email}
                                onChange={(e) => onChangeEmail?.(e.target.value)}
                                name={data?.email}
                                label={'Email'}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                    style: { zIndex: 1 },

                                }}
                            />
                        </Grid><Grid xs={12} sm={12} md={6} lg={6}>
                            <TextField
                                value={data?.extNumber}
                                onChange={(e) => onChangeExtNumber?.(e.target.value)}
                                name={data?.extNumber}
                                label={'Добавочный номер телефона'}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                    style: { zIndex: 1 },

                                }}
                            />
                        </Grid><Grid xs={12} sm={12} md={6} lg={6}>
                            <TextField
                                value={data?.telegram}
                                onChange={(e) => onChangeTelegram?.(e.target.value)}
                                name={data?.telegram}
                                label={'Telegram'}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                    style: { zIndex: 1 },

                                }}
                            />
                        </Grid><Grid xs={12} sm={12} md={6} lg={6}>
                            <TextField
                                value={data?.photoUrl}
                                onChange={(e) => onChangePhotoUrl?.(e.target.value)}
                                name={data?.photoUrl}
                                label={'Ссылка на фото'}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                    style: { zIndex: 1 },

                                }}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid
                sx={{
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    gap: 1,
                    flexDirection: 'column',
                }}
            >
                <Button
                    sx={{ width: '100%' }}
                    // disabled={loading || compareObjects(user, formData)}
                    variant="contained"
                    color="primary"
                    onClick={onSave}
                >
              Сохранить
                </Button>
                {/*{loading && (*/}
                {/*    <CircularProgress*/}
                {/*        size={24}*/}
                {/*        sx={{*/}
                {/*            color: green[500],*/}
                {/*            position: 'absolute',*/}
                {/*            top: '50%',*/}
                {/*            left: '50%',*/}
                {/*            marginTop: '-12px',*/}
                {/*            marginLeft: '-12px',*/}
                {/*        }}*/}
                {/*    />*/}
                {/*)}*/}
                <Button
                    type="reset"
                    sx={{ width: '100%' }}
                    // disabled={compareObjects(user, formData)}
                    variant="outlined"
                    color="primary"
                    onClick={onCancelEdit}
                >
              Отмена
                </Button>
            </Grid>
        </Grid>
    );
};