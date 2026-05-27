import React, { useState } from 'react';
import { Layout, Menu, Button, Typography, Badge, Avatar, Dropdown, Space, theme, Drawer, Grid, Spin } from 'antd';
import {
    MenuOutlined,
    DashboardOutlined,
    DatabaseOutlined,
    FileTextOutlined,
    BellOutlined,
    UserOutlined,
    LogoutOutlined,
    PlusOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLocalStorageData, removeLocalStorageData } from '../utils/storage';
import HealthStatus from '../components/common/HealthStatus';
import { healthService } from '../api/services/healthService';
import AddOrderModal from '../components/orders/AddOrderModal';


const { Header, Sider, Content } = Layout;
const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

const MainLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [addOrderModalOpen, setAddOrderModalOpen] = useState(false);
    const screens = useBreakpoint();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation();

    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const user = getLocalStorageData<any>('user') || {};

    const handleLogout = () => {
        removeLocalStorageData('token');
        removeLocalStorageData('user');
        navigate('/login');
    };



    const userMenu = {
        items: [
            {
                key: 'profile',
                label: 'My Profile',
                icon: <UserOutlined />,
                onClick: () => navigate('/profile'),
            },
            {
                key: 'logout',
                label: 'Logout',
                icon: <LogoutOutlined />,
                onClick: handleLogout,
            },
        ],
    };

    const menuItems = [
        {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            onClick: () => {
                navigate('/dashboard');
                setMobileMenuOpen(false);
            },
        },
        {
            key: '/master-data',
            icon: <DatabaseOutlined />,
            label: 'Master Data',
            onClick: () => {
                navigate('/master-data');
                setMobileMenuOpen(false);
            },
        },
        {
            key: '/orders',
            icon: <ShoppingCartOutlined />,
            label: 'Orders',
            onClick: () => {
                navigate('/orders');
                setMobileMenuOpen(false);
            },
        },
        {
            key: '/reports',
            icon: <FileTextOutlined />,
            label: 'Reports',
            onClick: () => {
                navigate('/reports');
                setMobileMenuOpen(false);
            },
        },
    ];

    // Mobile Drawer Content
    const drawerContent = (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #f0f0f0' }}>
                <Title level={4} style={{ margin: 0, color: '#00b96b' }}>
                    Admin Panel
                </Title>
            </div>
            <Menu
                theme="light"
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                style={{ borderRight: 0 }}
            />
        </div>
    );

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Desktop Sider - Only visible on md and larger screens */}
            {screens.md && (
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    theme="light"
                    width={250}
                    onMouseEnter={() => setCollapsed(false)}
                    onMouseLeave={() => setCollapsed(true)}
                    style={{
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        zIndex: 1000,
                        height: '100vh',
                        boxShadow: collapsed ? 'none' : '2px 0 8px rgba(0,0,0,0.15)'
                    }}
                >
                    <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #f0f0f0' }}>
                        <Title level={4} style={{ margin: 0, color: '#00b96b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {collapsed ? 'A' : 'Admin Panel'}
                        </Title>
                    </div>
                    <Menu
                        theme="light"
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        items={menuItems}
                        style={{ borderRight: 0 }}
                    />
                </Sider>
            )}

            {/* Mobile Drawer */}
            <Drawer
                placement="left"
                onClose={() => setMobileMenuOpen(false)}
                open={mobileMenuOpen}
                styles={{ body: { padding: 0 } }}
                width={250}
            >
                {drawerContent}
            </Drawer>

            <Layout style={{ marginLeft: screens.md ? (collapsed ? 80 : 250) : 0, transition: 'all 0.2s' }}>
                <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 999, width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {!screens.md && (
                            <Button
                                type="text"
                                icon={<MenuOutlined />}
                                onClick={() => setMobileMenuOpen(true)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                    marginRight: 16
                                }}
                            />
                        )}
                        <Text strong style={{ fontSize: '16px' }}>
                            My Business Name
                        </Text>
                    </div>

                    <Space size={24}>
                        {screens.md && (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setAddOrderModalOpen(true)}
                                style={{ backgroundColor: '#00b96b' }}
                            >
                                Add Order
                            </Button>
                        )}
                        {screens.md && <Text type="secondary">{currentDate}</Text>}

                        <Badge count={5} size="small">
                            <Button type="text" shape="circle" icon={<BellOutlined />} />
                        </Badge>

                        <Dropdown menu={userMenu} placement="bottomRight">
                            <Space style={{ cursor: 'pointer' }}>
                                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#00b96b' }} />
                                {screens.md && <Text>{user.full_name || 'Admin User'}</Text>}

                            </Space>
                        </Dropdown>
                    </Space>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        overflow: 'auto',
                    }}
                >
                    <HealthStatus />
                    <HealthCheckGuard>
                        <Outlet />
                    </HealthCheckGuard>
                </Content>
            </Layout>

            <AddOrderModal
                open={addOrderModalOpen}
                onClose={() => setAddOrderModalOpen(false)}
            />
        </Layout>
    );
};

const HealthCheckGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data, isLoading } = useQuery({
        queryKey: ['health-status'],
        queryFn: healthService.getHealthStatus,
        staleTime: Infinity,
    });

    const isHealthy = data?.success && data?.output?.app === 'up' && data?.output?.database === 'up';

    if (isLoading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" tip="Checking system health..." /></div>;
    }

    if (!isHealthy) {
        return null; // HealthStatus component will show the error message
    }

    return <>{children}</>;
};

export default MainLayout;
