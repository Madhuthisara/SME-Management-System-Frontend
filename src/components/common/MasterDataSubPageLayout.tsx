import React from 'react';
import { Button, Typography, Space } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface MasterDataSubPageLayoutProps {
    title: string;
    children: React.ReactNode;
    onAdd?: () => void;
    addButtonText?: string;
}

const MasterDataSubPageLayout: React.FC<MasterDataSubPageLayoutProps> = ({
    title,
    children,
    onAdd,
    addButtonText = 'Add New'
}) => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '0 12px' }}>
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/master-data')}
                        style={{ marginRight: 16 }}
                    />
                    <Title level={2} style={{ margin: 0 }}>
                        {title}
                    </Title>
                </div>
                {onAdd && (
                    <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
                        {addButtonText}
                    </Button>
                )}
            </div>
            {children}
        </div>
    );
};

export default MasterDataSubPageLayout;
