import { type ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState, useAppDispatch } from '../app/redux/store';
import { checkUser } from '../features/user/actions/userActions';
import Loader from '@/shared/ui/Loader/Loader';

const RequireAuth = ({ children }: { children: ReactNode }) => {
    const dispatch = useAppDispatch();
    const user = useSelector((state: RootState) => state.user.user);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        dispatch(checkUser()).then(() => {
            setAuthLoading(false);
        });
    }, [dispatch]);

    if (authLoading) {
        return <Loader />;
    }

    return user ? children : <Navigate to="/auth/login" replace />;
};

export default RequireAuth;
