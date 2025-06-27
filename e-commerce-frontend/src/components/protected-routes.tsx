import type { ReactElement } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { userReducerInitialStateTypes } from '../types/user-reducer';

type PropsProtectedRoutes = {
    children?: ReactElement;
    adminOnly?: boolean;
    isauthnticated?: boolean;
    redirect?: string;
};

const ProtectedRoutes = ({
    children,
    adminOnly = false,
    isauthnticated = false,
    redirect = "/"
}: PropsProtectedRoutes) => {
    const { user } = useSelector((state: { userReducer: userReducerInitialStateTypes }) => state.userReducer);

    if (!isauthnticated) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && user?.role !== "admin") {
        return <Navigate to={redirect} />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoutes;
