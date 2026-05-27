import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import MasterData from '../pages/MasterData';
import Reports from '../pages/Reports';
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';
import Profile from '../pages/Profile/Profile';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import OrderList from '../pages/Orders/OrderList';


// Master Data Sub-pages
import ProductCategories from '../pages/MasterData/Product/ProductCategories';
import Products from '../pages/MasterData/Product/Products';
import ProductTemplates from '../pages/MasterData/Product/ProductTemplates';
import ProductStock from '../pages/MasterData/Product/ProductStock';
import Materials from '../pages/MasterData/Material/Materials';
import MaterialAttributes from '../pages/MasterData/Material/MaterialAttributes';
import MaterialStock from '../pages/MasterData/Material/MaterialStock';
import OrderStatuses from '../pages/MasterData/OrderPayment/OrderStatuses';
import PaymentMethods from '../pages/MasterData/OrderPayment/PaymentMethods';
import PaymentStatuses from '../pages/MasterData/OrderPayment/PaymentStatuses';
import HeroSections from '../pages/MasterData/Product/HeroSections';
import Suppliers from '../pages/MasterData/Supplier/Suppliers';

const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Routes (wrapped in MainLayout and ProtectedRoute) */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />

                    {/* Master Data Routes */}
                    <Route path="master-data">
                        <Route index element={<MasterData />} />
                        <Route path="product-categories" element={<ProductCategories />} />
                        <Route path="products" element={<Products />} />
                        <Route path="product-templates" element={<ProductTemplates />} />
                        <Route path="product-stock" element={<ProductStock />} />
                        <Route path="materials" element={<Materials />} />
                        <Route path="material-attributes" element={<MaterialAttributes />} />
                        <Route path="material-stock" element={<MaterialStock />} />
                        <Route path="order-statuses" element={<OrderStatuses />} />
                        <Route path="payment-methods" element={<PaymentMethods />} />
                        <Route path="payment-statuses" element={<PaymentStatuses />} />
                        <Route path="heroes" element={<HeroSections />} />
                        <Route path="suppliers" element={<Suppliers />} />
                    </Route>

                    <Route path="reports" element={<Reports />} />
                    <Route path="orders" element={<OrderList />} />
                    <Route path="profile" element={<Profile />} />

                </Route>

                {/* Catch all - redirect to dashboard for now */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
