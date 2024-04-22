import { useEffect } from 'react';
import { AppRouter } from './providers/router';
import { useAppDispatch } from '@/shared/lib/hooks/AppDispatch';
import { checkUser } from '@/entities/User/model/actions/userActions';
import { useSelector } from 'react-redux';
import { getUserMounted } from '@/entities/User';

const App = () => {
  const dispatch = useAppDispatch();
  const userMounted = useSelector(getUserMounted);

  useEffect(() => {
    dispatch(checkUser());
  }, [dispatch]);

  return userMounted && <AppRouter />;
};

export default App;
