import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch';
import { Layout } from '@/widgets/Layout';
import Container from '@mui/material/Container';
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
import { getProfileData } from '../model/selectors/getProfileData/getProfileData';
import { PageWrapper } from '@/shared/ui/PageWrapper';
import { ValidateProfileError } from '../model/consts/consts';
import { Helmet } from 'react-helmet';

const reducers: ReducersList = {
  profile: profileReducer,
};

const validateErrorTranslates = {
  [ValidateProfileError.INCORRECT_TELEGRAM]:
    'Телеграм: только прописные и строчные латинские буквы, цифры, точки и нижнее подчеркивание.',
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

  const onChangeFirstName = useCallback(
    (value?: string) => {
      dispatch(profileActions.updateProfile({ firstName: value }));
    },
    [dispatch],
  );

  const onChangeSecondName = useCallback(
    (value?: string) => {
      dispatch(profileActions.updateProfile({ secondName: value }));
    },
    [dispatch],
  );

  const onChangeEmail = useCallback(
    (value?: string) => {
      dispatch(profileActions.updateProfile({ email: value }));
    },
    [dispatch],
  );

  const onChangeExtNumber = useCallback(
    (value?: string) => {
      dispatch(profileActions.updateProfile({ extNumber: value }));
    },
    [dispatch],
  );

  const onChangeTelegram = useCallback(
    (value?: string) => {
      dispatch(profileActions.updateProfile({ telegram: value }));
    },
    [dispatch],
  );

  const onCancelEdit = useCallback(() => {
    dispatch(profileActions.cancelEdit());
  }, [dispatch]);

  const onSave = useCallback(() => {
    dispatch(updateProfileData());
  }, [dispatch]);

  return (
    <DynamicModuleLoader reducers={reducers}>
      <Layout>
        <PageWrapper>
          <Helmet>
            <title>Профиль</title>
          </Helmet>
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
              onCancelEdit={onCancelEdit}
              onSave={onSave}
            />
            {validateErrors?.length &&
              validateErrors.map((error) => (
                <Alert key={error} severity="error" sx={{ my: 2 }} data-testid="ProfilePage.Error">
                  {validateErrorTranslates[error]}
                </Alert>
              ))}
          </Container>
        </PageWrapper>
      </Layout>
    </DynamicModuleLoader>
  );
};

export default ProfilePage;
