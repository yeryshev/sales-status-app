import { type ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { checkUser } from '../entities/user/model/actions/userActions';
import Loader from '@/shared/ui/Loader/Loader';
import { useAppDispatch, RootState } from '@/app/providers/StoreProvider/config/store';

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
