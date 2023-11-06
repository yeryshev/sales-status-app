import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import { AppBar, Toolbar } from '@mui/material';
import { useAppDispatch } from '../../redux/store';
import { setUser } from '../../features/user/slice/userSlice';
import { FormEvent } from 'react';
import { checkUser } from '../../features/user/actions/userActions';
import axios from 'axios';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.set('username', event.currentTarget.email.value);
    formData.set('password', event.currentTarget.password.value);

    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/auth/jwt/login`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    );

    // let detail;

    switch (response.status) {
      case 400:
        alert('Неверный логин или пароль');
        return;
      case 422:
        //   detail = (await response.json()).detail;
        //   // alert(detail[0].msg);
        //   alert(detail[0].loc[0] + ' ' + detail[0].msg + ' ' + detail[0].loc[1]);
        alert('Неверный логин или пароль');
        return;
      case 204:
        dispatch(checkUser())
          .then((user) => dispatch(setUser(user)))
          .then(() => {
            navigate('/');
          });
        return;
      default:
        alert('Что-то пошло не так');
        return;
    }
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          {/* <HomeIcon sx={{ mr: 2 }} /> */}
          <Typography variant="h6" color="inherit" noWrap>
            Team Status
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Авторизация
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Почта"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Войти
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <MuiLink variant="body2" component={RouterLink} to="/auth/register">
                  {'Нет аккаунта? Зарегистрироваться'}
                </MuiLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}
