import React from 'react';
import { Card, Tabs, Typography, Spin } from 'antd';
import { UserOutlined, ShopOutlined, LockOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import PersonalInfoForm from './components/PersonalInfoForm';
import CompanyInfoForm from './components/CompanyInfoForm';
import SecurityForm from './components/SecurityForm';
import { profileService } from '../../api/services/profileService';

const { Title, Text } = Typography;

const Profile: React.FC = () => {
    const { data: response, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: profileService.getProfile,
    });

    const profileData = response?.output;

    const items = [
        {
            key: '1',
            label: (
                <span>
                    <UserOutlined />
                    Personal Details
                </span>
            ),
            children: profileData ? (
                <PersonalInfoForm initialValues={profileData.user} />
            ) : null,
        },
        {
            key: '2',
            label: (
                <span>
                    <ShopOutlined />
                    Company Details
                </span>
            ),
            children: profileData ? (
                <CompanyInfoForm initialValues={profileData.business} />
            ) : null,
        },
        {
            key: '3',
            label: (
                <span>
                    <LockOutlined />
                    Security
                </span>
            ),
            children: <SecurityForm />,
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 24 }}>
                <Title level={2}>My Profile</Title>
                <Text type="secondary">Manage your personal details, company information, and account security.</Text>
            </div>
            <Card bordered={false} style={{ borderRadius: 8 }}>
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '50px 0' }}>
                        <Spin size="large" tip="Loading profile..." />
                    </div>
                ) : (
                    <Tabs defaultActiveKey="1" items={items} />
                )}
            </Card>
        </div>
    );
};

export default Profile;
