import Layout from '../../components/Layout/Layout';
import StatusBox from '../../Pages/Dashboard/StatusBox/StatusBox';
import { CircularProgress, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../redux/store';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { updateUser } from '../../features/user/actions/userActions';
import { User } from '../../types/User';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Toolbar,
  Container,
  Grid,
  Paper,
  Avatar,
  TextField,
  Switch,
  Button,
  Badge,
  IconButton,
} from '@mui/material';
import { green } from '@mui/material/colors';

const Profile = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<User>(user as User);
  const [loading, setLoading] = useState(false);
  const timer = useRef<number>();

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSwitch = (e: ChangeEvent<HTMLInputElement>) => {
    if (user) {
      dispatch(
        updateUser({
          ...user,
          isWorkingRemotely: e.target.checked,
        })
      );
    }
  };

  const handleUpdateAll = async () => {
    if (user) {
      dispatch(updateUser({ ...formData, id: user.id }));
    }
    setLoading(true);
    timer.current = window.setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleDivClick = () => {
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sendFile(file);
    }
  };

  const sendFile = async (file: File) => {
    try {
      const data = new FormData();
      data.append('avatar', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: data,
      });
      const result = await response.json();
      if (user) {
        dispatch(updateUser({ ...user, photoUrl: result.path }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} lg={3}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  justifyContent: 'center',
                  marginBottom: (theme) => theme.spacing(2),
                }}
              >
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                  sx={{ width: '100%' }}
                >
                  <Grid item md={6}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <div onClick={handleDivClick} style={{ cursor: 'pointer' }}>
                          <IconButton
                            sx={{
                              position: 'absolute',
                              top: '0',
                              left: '0',
                              backgroundColor: 'white',
                            }}
                            aria-label="edit"
                          >
                            <EditIcon />
                          </IconButton>
                          <input
                            accept="image/*"
                            type="file"
                            id="file-input"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                          />
                        </div>
                      }
                    >
                      <Avatar
                        src={user?.photoUrl}
                        sx={{ width: 100, height: 100 }}
                        alt={formData.firstName}
                      />
                    </Badge>
                  </Grid>
                  <Grid item md={6}>
                    <Typography>{user?.firstName}</Typography>
                    <Typography>{user?.secondName}</Typography>
                  </Grid>
                </Grid>
                <div>
                  <span>Удаленная работа</span>
                  <Switch
                    color="primary"
                    name="isWorkingRemotely"
                    checked={user?.isWorkingRemotely}
                    onChange={(e) => handleSwitch(e)}
                  />
                </div>
              </Paper>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <StatusBox />
              </Paper>
            </Grid>
            <Grid item xs={12} md={8} lg={9}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      name="firstName"
                      onChange={(e) => handleChange(e)}
                      label="Имя"
                      value={formData.firstName || ''}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                        style: { zIndex: 1 },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      name="secondName"
                      onChange={(e) => handleChange(e)}
                      label="Фамилия"
                      value={formData.secondName || ''}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                        style: { zIndex: 1 },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      name="email"
                      autoComplete="off"
                      onChange={(e) => handleChange(e)}
                      label="Email"
                      value={formData.email || ''}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                        style: { zIndex: 1 },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      name="extNumber"
                      onChange={(e) => handleChange(e)}
                      label="Добавочный номер телефона"
                      value={formData.extNumber || ''}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                        style: { zIndex: 1 },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      name="telegram"
                      onChange={(e) => handleChange(e)}
                      label="Telegram"
                      value={formData.telegram || ''}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                        style: { zIndex: 1 },
                      }}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 1, position: 'relative', width: '100%' }}>
                  <Button
                    sx={{ width: '100%' }}
                    disabled={
                      loading ||
                      JSON.stringify({
                        ...formData,
                        isWorkingRemotely: user?.isWorkingRemotely,
                        statusId: user?.statusId,
                        photo: user?.photoUrl,
                      }) === JSON.stringify(user)
                    }
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateAll}
                  >
                    Сохранить
                  </Button>
                  {loading && (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: green[500],
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                      }}
                    />
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
};

export default Profile;
