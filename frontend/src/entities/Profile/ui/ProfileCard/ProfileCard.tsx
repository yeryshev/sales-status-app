import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useCallback } from 'react';
import { Profile } from '../../model/types/profile';

interface ProfileCardProps {
  profileData?: Profile;
  formData?: Profile;
  isLoading?: boolean;
  error?: string;
  onChangeFirstName?: (value?: string) => void;
  onChangeSecondName?: (value?: string) => void;
  onChangeEmail?: (value?: string) => void;
  onChangeExtNumber?: (value?: string) => void;
  onChangeTelegram?: (value?: string) => void;
  onCancelEdit?: () => void;
  onSave?: () => void;
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
    onCancelEdit,
    onSave,
  } = props;

  const isDataChanged = useCallback((serverData: Profile = {}, pageData: Profile = {}) => {
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
        <Alert sx={{ width: '100%' }} severity="error">
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Grid container spacing={3} mt={4}>
      <Grid xs={12} sm={12} lg={12} className="form-column">
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
                id="profile-first-name"
                value={formData?.firstName ?? ''}
                onChange={(e) => onChangeFirstName?.(e.target.value)}
                name="firstName"
                label={'Имя'}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  style: { zIndex: 1 },
                }}
                data-testid="ProfileCard.FirstName"
              />
            </Grid>
            <Grid xs={12} sm={12} md={6} lg={6}>
              <TextField
                id="profile-second-name"
                value={formData?.secondName ?? ''}
                onChange={(e) => onChangeSecondName?.(e.target.value)}
                name="secondName"
                label={'Фамилия'}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  style: { zIndex: 1 },
                }}
                data-testid="ProfileCard.SecondName"
              />
            </Grid>
            <Grid xs={12} sm={12} md={6} lg={6}>
              <TextField
                id="profile-inside-id"
                value={formData?.insideId ?? ''}
                disabled={true}
                name="insideId"
                label={'Inside Id'}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  style: { zIndex: 1 },
                }}
                data-testid="ProfileCard.InsideId"
              />
            </Grid>
            <Grid xs={12} sm={12} md={6} lg={6}>
              <TextField
                id="profile-email"
                value={formData?.email ?? ''}
                onChange={(e) => onChangeEmail?.(e.target.value)}
                disabled={true}
                name="email"
                label={'Email'}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  style: { zIndex: 1 },
                }}
                data-testid="ProfileCard.Email"
              />
            </Grid>
            <Grid xs={12} sm={12} md={6} lg={6}>
              <TextField
                id="profile-ext-number"
                value={formData?.extNumber ?? ''}
                onChange={(e) => onChangeExtNumber?.(e.target.value)}
                disabled={true}
                name="extNumber"
                label={'Добавочный номер телефона'}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  style: { zIndex: 1 },
                }}
                data-testid="ProfileCard.ExtNumber"
              />
            </Grid>
            <Grid xs={12} sm={12} md={6} lg={6}>
              <TextField
                id="profile-telegram"
                value={formData?.telegram ?? ''}
                onChange={(e) => onChangeTelegram?.(e.target.value)}
                name="telegram"
                label={'Telegram'}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                  style: { zIndex: 1 },
                }}
                data-testid="ProfileCard.Telegram"
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
          data-testid="ProfileCard.SaveButton"
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
          data-testid="ProfileCard.CancelButton"
        >
          Отмена
        </Button>
      </Grid>
    </Grid>
  );
};
