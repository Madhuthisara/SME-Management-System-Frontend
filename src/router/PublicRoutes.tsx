import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';

const PublicRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Navigate replace to="/login" />} />
        </Routes>
    );
};

export default PublicRoutes;
