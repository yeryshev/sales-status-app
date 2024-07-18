import { useEffect } from 'react';
import { AppRouter } from '../providers/router';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch';
import { checkUser, getUserMounted } from '@/entities/User';
import { useSelector } from 'react-redux';

const BaseLayout = () => {
  const dispatch = useAppDispatch();
  const userMounted = useSelector(getUserMounted);

  useEffect(() => {
    dispatch(checkUser());
  }, [dispatch]);

  return userMounted && <AppRouter />;
};

export default BaseLayout;
