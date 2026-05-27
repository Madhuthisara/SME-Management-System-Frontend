import React from 'react';
import { Typography, Card, Row, Col, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    LinkOutlined,
    ShoppingOutlined,
    FileTextOutlined,
    CodeSandboxOutlined,
    AppstoreOutlined,
    SettingOutlined,
    DatabaseOutlined,
    CheckCircleOutlined,
    CreditCardOutlined,
    TagOutlined,
    RightOutlined,
    BankOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface MenuItem {
    title: string;
    description: string;
    icon: React.ReactNode;
    path: string;
}

interface MenuSection {
    title: string;
    items: MenuItem[];
}

const MasterData: React.FC = () => {
    const navigate = useNavigate();
    const {
        token: { colorPrimary, borderRadiusLG },
    } = theme.useToken();

    const sections: MenuSection[] = [
        {
            title: 'Product Management',
            items: [
                {
                    title: 'Hero Sections',
                    description: 'Manage homepage hero carousel images and descriptions.',
                    icon: <FileTextOutlined style={{ fontSize: '24px', color: colorPrimary }} />,
                    path: '/master-data/heroes',
                },
                {
                    title: 'Product Categories/Collections',
                    description: 'Manage categories for products.',
                    icon: <LinkOutlined style={{ fontSize: '24px', color: colorPrimary }} />,
                    path: '/master-data/product-categories',
                },
                {
                    title: 'Products',
                    description: 'Manage final products for sale.',
                    icon: <ShoppingOutlined style={{ fontSize: '24px', color: colorPrimary }} />,
                    path: '/master-data/products',
                },
                {
                    title: 'Product Templates',
                    description: 'Define reusable product structures (BOMs).',
                    icon: <FileTextOutlined style={{ fontSize: '24px', color: colorPrimary }} />,
                    path: '/master-data/product-templates',
                },
                {
                    title: 'Product Stock',
                    description: 'Manage inventory for final products.',
                    icon: <CodeSandboxOutlined style={{ fontSize: '24px', color: colorPrimary }} />,
                    path: '/master-data/product-stock',
                },
            ],
        },
        {
            title: 'Material Management',
            items: [
                {
                    title: 'Suppliers',
                    description: 'Manage external suppliers and contact details.',
                    icon: <BankOutlined style={{ fontSize: '24px', color: colorPrimary }} />,
                    path: '/master-data/suppliers',
                },
                {
                    title: 'Materials',
                    description: 'Manage raw materials and components.',
                    icon: <AppstoreOutlined style={{ fontSize: '24px', color: colorPrimary }} />,
                    path: '/master-data/materials',
                },
                {
                    title: 'Material Attributes',
                    description: 'Define attributes for materials like color or size.',
                    icon: <SettingOutlined style={{ fontSize: '24px', color: colorPrimary }} />,
                    path: '/master-data/material-attributes',
                },
                {
                    title: 'Material Stock',
                    description: 'Manage inventory levels for material variants.',
                    icon: <DatabaseOutlined style={{ fontSize: '24px', color: colorPrimary }} />,
                    path: '/master-data/material-stock',
                },
            ],
        },
        {
            title: 'Order & Payment Settings',
            items: [
                {
                    title: 'Order Statuses',
                    description: 'Define order lifecycle statuses.',
                    icon: <CheckCircleOutlined style={{ fontSize: '24px', color: colorPrimary }} />,
                    path: '/master-data/order-statuses',
                },
                {
                    title: 'Payment Methods',
                    description: 'Manage accepted payment methods.',
                    icon: <CreditCardOutlined style={{ fontSize: '24px', color: colorPrimary }} />,
                    path: '/master-data/payment-methods',
                },
                {
                    title: 'Payment Statuses',
                    description: 'Define payment lifecycle statuses.',
                    icon: <TagOutlined style={{ fontSize: '24px', color: colorPrimary }} />,
                    path: '/master-data/payment-statuses',
                },
            ],
        },
    ];

    return (
        <div style={{ padding: '0 12px' }}>
            <div style={{ marginBottom: 32 }}>
                <Title level={2} style={{ marginBottom: 0 }}>Master Data</Title>
                <Text type="secondary">Manage the core data that drives your business operations.</Text>
            </div>

            {sections.map((section, index) => (
                <div key={index} style={{ marginBottom: 32 }}>
                    <Title level={4} style={{ marginBottom: 16 }}>{section.title}</Title>
                    <Row gutter={[16, 16]}>
                        {section.items.map((item, itemIndex) => (
                            <Col xs={24} md={12} lg={8} key={itemIndex}>
                                <Card
                                    hoverable
                                    style={{ height: '100%', borderRadius: borderRadiusLG }}
                                    bodyStyle={{ padding: '16px 24px' }}
                                    onClick={() => navigate(item.path)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                            <div
                                                style={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: 8,
                                                    backgroundColor: '#f0f5ff', // Light blue background for icon
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {item.icon}
                                            </div>
                                            <div>
                                                <Title level={5} style={{ margin: 0, fontSize: '16px' }}>
                                                    {item.title}
                                                </Title>
                                                <Paragraph type="secondary" style={{ margin: 0, fontSize: '12px', lineHeight: '1.5' }}>
                                                    {item.description}
                                                </Paragraph>
                                            </div>
                                        </div>
                                        <RightOutlined style={{ color: '#bfbfbf' }} />
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            ))}
        </div>
    );
};

export default MasterData;
