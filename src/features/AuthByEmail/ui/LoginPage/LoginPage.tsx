import { useAppDispatch } from '@/shared/lib/hooks/AppDispatch';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { AppBar, Toolbar } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FormEvent, memo, useCallback, useEffect } from 'react';
import { loginByUsername } from '../../model/services/loginByUsername/loginByUsername';
import { useSelector } from 'react-redux';
import Alert from '@mui/material/Alert';
import { loginActions, loginReducer } from '../../model/slice/loginSlice';
import { useNavigate } from 'react-router-dom';
import { getUserAuthData } from '@/entities/User';
import { getLoginUsername } from '../../model/selectors/getLoginUsername/getLoginUsername';
import { getLoginPassword } from '../../model/selectors/getLoginPassword/getLoginPassword';
import { getLoginIsLoading } from '../../model/selectors/getLoginIsLoading/getLoginIsLoading';
import { getLoginError } from '../../model/selectors/getLoginError/getLoginError';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';

const initialReducers: ReducersList = {
    loginForm: loginReducer,
};

const LoginPage = memo(() => {
    const dispatch = useAppDispatch();
    const authData = useSelector(getUserAuthData);
    const navigate = useNavigate()
    const username = useSelector(getLoginUsername)
    const password = useSelector(getLoginPassword)
    const isLoading = useSelector(getLoginIsLoading)
    const error = useSelector(getLoginError)

    useEffect(() => {
        if (authData) navigate('/')
    }, [authData, navigate]);

    const onChangeUsername = useCallback((value: string) => {
        dispatch(loginActions.setUsername(value));
    }, [dispatch]);

    const onChangePassword = useCallback((value: string) => {
        dispatch(loginActions.setPassword(value));
    }, [dispatch]);

    const onSubmitForm = useCallback((event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const username = event.currentTarget.email.value;
        const password = event.currentTarget.password.value;

        dispatch(loginByUsername({ username, password }))
    }, [dispatch])

    return (
        <DynamicModuleLoader
            removeAfterUnmount
            reducers={initialReducers}
        >
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
                            Авторизация
                        </Typography>
                        <Box
                            component="form"
                            noValidate
                            sx={{ mt: 1 }}
                            onSubmit={(e) => onSubmitForm(e)}
                        >
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Почта"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={username}
                                onChange={(e) => onChangeUsername(e.target.value)}
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
                                value={password}
                                onChange={(e) => onChangePassword(e.target.value)}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={isLoading}>
                                Войти
                            </Button>
                            {error && <Alert severity="error">{error}</Alert>}
                        </Box>
                    </Box>
                </Container>
            </>
        </DynamicModuleLoader>
    );
});

export default LoginPage