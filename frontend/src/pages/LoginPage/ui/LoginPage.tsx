import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Toolbar } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { LoginForm } from '@/features/AuthByEmail';
import { SsoAuthWrapper } from '@/features/SsoAuth';
import { Helmet } from 'react-helmet';

const LoginPage = memo(() => {
  return (
    <>
      <Helmet>
        <title>Авторизация</title>
      </Helmet>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Sales Status
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="xs" data-testid={'login-page'}>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <SsoAuthWrapper>
            <>
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
                Авторизация
              </Typography>
              <LoginForm />
            </>
          </SsoAuthWrapper>
        </Box>
      </Container>
    </>
  );
});

export default LoginPage;
