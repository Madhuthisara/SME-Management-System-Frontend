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
    const location = useLocation();

    console.log(`[ProtectedRoute] Checking token for path: ${location.pathname}`);
    if (!token) {
        console.warn("[ProtectedRoute] No token found! Redirecting to /login");
        // Redirect to login but save the current location so we can come back
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    console.log("[ProtectedRoute] Token found. Access granted.");
    return <>{children}</>;
};

export default ProtectedRoute;
