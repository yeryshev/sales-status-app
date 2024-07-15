import { useAppDispatch } from '../../../shared/lib/hooks/AppDispatch';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FormEvent, memo, useCallback } from 'react';
import { loginByUsername } from '../model/services/loginByUsername/loginByUsername';
import { useSelector } from 'react-redux';
import Alert from '@mui/material/Alert';
import { loginActions, loginReducer } from '../model/slice/loginSlice';
import { getLoginUsername } from '../model/selectors/getLoginUsername/getLoginUsername';
import { getLoginPassword } from '../model/selectors/getLoginPassword/getLoginPassword';
import { getLoginIsLoading } from '../model/selectors/getLoginIsLoading/getLoginIsLoading';
import { getLoginError } from '../model/selectors/getLoginError/getLoginError';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { useLocation, useNavigate } from 'react-router-dom';

import { RoutePath } from '@/shared/const/router';

const initialReducers: ReducersList = {
  loginForm: loginReducer,
};

export const LoginForm = memo(() => {
  const dispatch = useAppDispatch();
  const username = useSelector(getLoginUsername);
  const password = useSelector(getLoginPassword);
  const isLoading = useSelector(getLoginIsLoading);
  const error = useSelector(getLoginError);
  const navigate = useNavigate();
  const location = useLocation();

  const onChangeUsername = useCallback(
    (value: string) => {
      dispatch(loginActions.setUsername(value));
    },
    [dispatch],
  );

  const onChangePassword = useCallback(
    (value: string) => {
      dispatch(loginActions.setPassword(value));
    },
    [dispatch],
  );

  const onSubmitForm = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const username = event.currentTarget.email.value;
      const password = event.currentTarget.password.value;
      dispatch(loginByUsername({ username, password })).then(
        (data) => !data.payload && navigate(location.state?.from.pathname ?? RoutePath.main),
      );
    },
    [dispatch, location.state?.from.pathname, navigate],
  );

  return (
    <DynamicModuleLoader reducers={initialReducers}>
      <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={(e) => onSubmitForm(e)}>
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
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isLoading}>
          Войти
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </DynamicModuleLoader>
  );
});
