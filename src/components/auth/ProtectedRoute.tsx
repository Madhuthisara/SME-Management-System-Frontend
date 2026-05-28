import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getLocalStorageData } from '../../utils/storage';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * A wrapper component that checks if the user is logged in.
 * If not, it redirects them to the login page.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = getLocalStorageData<string>('token');
    const user = getLocalStorageData<any>('user');
    const location = useLocation();

    console.log(`[ProtectedRoute] Checking auth for path: ${location.pathname}`);

    // Pass if we have a token OR a user object (which might indicate a valid session)
    if (!token && !user) {
        console.warn("[ProtectedRoute] No token or user found! Redirecting to /login");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    console.log(`[ProtectedRoute] Access granted via ${token ? 'token' : 'session/user'}`);
    return <>{children}</>;
};

export default ProtectedRoute;
