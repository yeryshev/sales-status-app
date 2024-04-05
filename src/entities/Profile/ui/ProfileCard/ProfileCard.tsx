import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import { Profile } from '@/pages/ProfilePage/model/types/profile';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useCallback } from 'react';

interface ProfileCardProps {
  profileData?: Profile
  formData?: Profile
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
        profileData,
        formData,
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

    const isDataChanged = useCallback((
        serverData: Profile = {},
        pageData: Profile = {},
    ) => {
        return JSON.stringify(serverData) !== JSON.stringify(pageData);
    }, []);

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    mt: 20,
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
        <Grid container spacing={3} mt={4}>
            <Grid xs={12} sm={4} lg={3} className="avatar-column">
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                        justifyContent: 'center',
                    }}
                >
                    <Box>
                        <Avatar
                            src={formData?.photoUrl}
                            sx={{
                                aspectRatio: '1/1',
                                width: '100%',
                                height: '100%',
                            }}
                            alt={formData?.firstName}
                            className="avatar-container"
                        />
                    </Box>
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
                                value={formData?.firstName ?? ''}
                                onChange={(e) => onChangeFirstName?.(e.target.value)}
                                name={formData?.firstName}
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
                                value={formData?.secondName ?? ''}
                                onChange={(e) => onChangeSecondName?.(e.target.value)}
                                name={formData?.secondName}
                                label={'Фамилия'}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                    style: { zIndex: 1 },

                                }}
                            />
                        </Grid>
                        <Grid xs={12} sm={12} md={6} lg={6}>
                            <TextField
                                value={formData?.insideId ?? ''}
                                disabled={true}
                                name={String(formData?.insideId)}
                                label={'Inside Id'}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                    style: { zIndex: 1 },

                                }}
                            />
                        </Grid>
                        <Grid xs={12} sm={12} md={6} lg={6}>
                            <TextField
                                value={formData?.email ?? ''}
                                onChange={(e) => onChangeEmail?.(e.target.value)}
                                disabled={true}
                                name={formData?.email}
                                label={'Email'}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                    style: { zIndex: 1 },

                                }}
                            />
                        </Grid>
                        <Grid xs={12} sm={12} md={6} lg={6}>
                            <TextField
                                value={formData?.extNumber ?? ''}
                                onChange={(e) => onChangeExtNumber?.(e.target.value)}
                                disabled={true}
                                name={formData?.extNumber}
                                label={'Добавочный номер телефона'}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                    style: { zIndex: 1 },

                                }}
                            />
                        </Grid>
                        <Grid xs={12} sm={12} md={6} lg={6}>
                            <TextField
                                value={formData?.telegram ?? ''}
                                onChange={(e) => onChangeTelegram?.(e.target.value)}
                                name={formData?.telegram}
                                label={'Telegram'}
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                    style: { zIndex: 1 },

                                }}
                            />
                        </Grid>
                        <Grid xs={12} sm={12} md={6} lg={6}>
                            <TextField
                                value={formData?.photoUrl ?? ''}
                                onChange={(e) => onChangePhotoUrl?.(e.target.value)}
                                name={formData?.photoUrl}
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
                    disabled={!isDataChanged(profileData, formData)}
                    variant="contained"
                    color="primary"
                    onClick={onSave}
                >
              Сохранить
                </Button>
                <Button
                    type="reset"
                    sx={{ width: '100%' }}
                    disabled={!isDataChanged(profileData, formData)}
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