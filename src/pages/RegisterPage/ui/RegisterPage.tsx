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
import { Link as MuiLink, AppBar, Toolbar } from '@mui/material';
import { type FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../entities/Users/model/slice/userSlice';

export default function RegisterPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: data.get('email'),
                password: data.get('password'),
            }),
        });

        let detail;
        let user;

        switch (response.status) {
        case 400:
            alert('Такой пользователь уже существует');
            return;
        case 422:
            detail = (await response.json()).detail;
            alert(detail[0].msg);
            return;
        case 201:
            user = await response.json();
            dispatch(setUser(user));
            navigate('/');
            return;
        default:
            alert('Что-то пошло не так');
        }
    };

    return (
        <>
            <CssBaseline />
            <AppBar position="relative">
                <Toolbar>
                    <Typography variant="h6" color="inherit" noWrap>
                        Selectel - Inbound Sales
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
                        Регистрация
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Почта"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Пароль"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                />
                            </Grid>
                        </Grid>
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            Создать аккаунт
                        </Button>
                        <Grid container justifyContent="center">
                            <Grid item>
                                <MuiLink variant="body2" component={RouterLink} to="/auth/login">
                                    {'Уже есть аккаунт? Войти'}
                                </MuiLink>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    );
}
