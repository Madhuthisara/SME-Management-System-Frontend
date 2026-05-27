import React from 'react';
import { Alert, Space, Typography } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { healthService } from '../../api/services/healthService';

const { Text } = Typography;

const HealthStatus: React.FC = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['health-status'],
        queryFn: healthService.getHealthStatus,
        retry: false, // Don't retry if it fails
        staleTime: Infinity, // Keep it fresh forever (only run once)
    });

    const isHealthy = data?.success && data?.output?.app === 'up' && data?.output?.database === 'up';

    if (isLoading || isHealthy) {
        return null;
    }

    const errorMessage = isError
        ? "System is currently offline. Please try again later."
        : `System issues detected: App is ${data?.output?.app}, Database is ${data?.output?.database}.`;

    return (
        <div style={{ marginBottom: 16 }}>
            <Alert
                message="System Status Warning"
                description={
                    <Space direction="vertical">
                        <Text>{errorMessage}</Text>
                        {data?.output?.timestamp && (
                            <Text type="secondary" style={{ fontSize: '10px' }}>
                                Last Check: {new Date(data.output.timestamp).toLocaleString()}
                            </Text>
                        )}
                    </Space>
                }
                type="error"
                showIcon
                banner
            />
        </div>
    );
};

export default HealthStatus;
