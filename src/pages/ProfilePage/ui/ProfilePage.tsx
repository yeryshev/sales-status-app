import { useAppDispatch } from '@/shared/lib/hooks/AppDispatch';
import { Layout } from '@/widgets/Layout';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DynamicModuleLoader, ReducersList } from '@/shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { ProfileCard } from '@/entities/Profile';
import { fetchProfileData } from '../model/services/fetchProfileData/fetchProfileData';
import { profileActions, profileReducer } from '../model/slice/profileSlice';
import { getProfileIsLoading } from '../model/selectors/getProfileIsLoading/getProfileIsLoading';
import { getProfileError } from '../model/selectors/getProfileError/getProfileError';
import { getProfileForm } from '../model/selectors/getProfileForm/getProfileForm';
import { updateProfileData } from '../model/services/updateProfileData/updateProfileData';
import { getProfileValidateErrors } from '../model/selectors/getProfileValidateError/getProfileValidateErrors';
import Alert from '@mui/material/Alert';
import { ValidateProfileError } from '../model/types/profile';
import { getProfileData } from '@/pages/ProfilePage/model/selectors/getProfileData/getProfileData';

const reducers: ReducersList = {
    profile: profileReducer,
};

const validateErrorTranslates = {
    [ValidateProfileError.INCORRECT_TELEGRAM]: 'Телеграм: только прописные и строчные латинские буквы, цифры, точки и нижнее подчеркивание.',
    [ValidateProfileError.INCORRECT_EXT_NUMBER]: 'Добавочный номер телефона: доступны только цифры.',
    [ValidateProfileError.NO_DATA]: 'Данные не указаны',
    [ValidateProfileError.SERVER_ERROR]: 'Серверная ошибка при сохранении',
};

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const profileData = useSelector(getProfileData);
    const formData = useSelector(getProfileForm);
    const isLoading = useSelector(getProfileIsLoading);
    const error = useSelector(getProfileError);
    const validateErrors = useSelector(getProfileValidateErrors);
  
    useEffect(() => {
        dispatch(fetchProfileData());
    }, [dispatch]);

    const onChangeFirstName = useCallback((value?: string) => {
        dispatch(profileActions.updateProfile({ firstName: value }));
    }, [dispatch]);

    const onChangeSecondName = useCallback((value?: string) => {
        dispatch(profileActions.updateProfile({ secondName: value }));
    }, [dispatch]);

    const onChangeEmail = useCallback((value?: string) => {
        dispatch(profileActions.updateProfile({ email: value }));
    }, [dispatch]);

    const onChangeExtNumber = useCallback((value?: string) => {
        dispatch(profileActions.updateProfile({ extNumber: value }));
    }, [dispatch]);

    const onChangeTelegram = useCallback((value?: string) => {
        dispatch(profileActions.updateProfile({ telegram: value }));
    }, [dispatch]);

    const onChangePhotoUrl = useCallback((value?: string) => {
        dispatch(profileActions.updateProfile({ photoUrl: value }));
    }, [dispatch]);

    const onCancelEdit = useCallback(() => {
        dispatch(profileActions.cancelEdit());
    }, [dispatch]);

    const onSave = useCallback(() => {
        dispatch(updateProfileData());
    }, [dispatch]);

    return (
        <DynamicModuleLoader reducers={reducers} removeAfterUnmount={true}>
            <Layout>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    <Container maxWidth="lg" className="container">
                        <ProfileCard
                            formData={formData}
                            profileData={profileData}
                            isLoading={isLoading}
                            error={error}
                            onChangeFirstName={onChangeFirstName}
                            onChangeSecondName={onChangeSecondName}
                            onChangeEmail={onChangeEmail}
                            onChangeExtNumber={onChangeExtNumber}
                            onChangeTelegram={onChangeTelegram}
                            onChangePhotoUrl={onChangePhotoUrl}
                            onCancelEdit={onCancelEdit}
                            onSave={onSave}
                        />
                        {validateErrors?.length && (
                            validateErrors.map((error) => (
                                <Alert key={error} severity="error" sx={{ my: 2 }}>{validateErrorTranslates[error]}</Alert>
                            ))
                        )}
                    </Container>
                </Box>
            </Layout>
        </DynamicModuleLoader>
    );
};

export default ProfilePage;
