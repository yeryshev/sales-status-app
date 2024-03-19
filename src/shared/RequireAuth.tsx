import { type ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { checkUser } from '@/entities/User/model/actions/userActions';
import Loader from '@/shared/ui/Loader/Loader';
import { useAppDispatch } from '@/shared/lib/hooks/AppDispatch';
import { StateSchema } from '@/app/providers/StoreProvider';

const RequireAuth = ({ children }: { children: ReactNode }) => {
    const dispatch = useAppDispatch();
    const user = useSelector((state: StateSchema) => state.user.user);
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
