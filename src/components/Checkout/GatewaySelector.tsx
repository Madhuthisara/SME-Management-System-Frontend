import React, { useEffect, useState } from 'react';
import { Radio, Spin, Alert, Typography, Space, Image } from 'antd';
import { getActiveMethods } from '../../api/services/paymentSettingsService';
import type { ActivePaymentMethod, GatewayName } from '../../api/services/paymentSettingsService';

const { Text } = Typography;

interface Props {
    businessId: string;
    /** Called when the customer selects a gateway */
    onSelect: (gatewayName: GatewayName) => void;
    /** Currently selected gateway (controlled from parent) */
    selected?: GatewayName | null;
}

const FALLBACK_LOGOS: Record<GatewayName, string> = {
    stripe: 'https://stripe.com/img/v3/home/social.png',
    paypal: 'https://www.paypalobjects.com/webstatic/icon/pp258.png',
    payhere: 'https://www.payhere.lk/static/images/logo.png',
};

/**
 * Customer-facing checkout gateway selector.
 * Fetches active gateways for the business and presents them as radio tiles.
 * Selected gateway_name is passed to the payment initiation handler.
 */
const GatewaySelector: React.FC<Props> = ({ businessId, onSelect, selected }) => {
    const [methods, setMethods] = useState<ActivePaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getActiveMethods(businessId);
                const data = res.data?.output ?? [];
                setMethods(data);
                // Auto-select the first gateway if none is selected
                if (!selected && data.length > 0) {
                    onSelect(data[0].gateway_name);
                }
            } catch {
                setError('Could not load payment options. Please refresh and try again.');
            } finally {
                setLoading(false);
            }
        };
        if (businessId) fetch();
    }, [businessId]); // eslint-disable-line react-hooks/exhaustive-deps

    if (loading) return <Spin tip="Loading payment options..." />;

    if (error) return <Alert type="error" message={error} showIcon />;

    if (methods.length === 0) {
        return (
            <Alert
                type="warning"
                message="No payment methods available for this store."
                showIcon
            />
        );
    }

    return (
        <div>
            <Text strong style={{ display: 'block', marginBottom: 12 }}>
                Select Payment Method
            </Text>

            <Radio.Group
                value={selected}
                onChange={e => onSelect(e.target.value as GatewayName)}
                style={{ width: '100%' }}
            >
                <Space direction="vertical" style={{ width: '100%' }} size={10}>
                    {methods.map(method => (
                        <Radio
                            key={method.gateway_name}
                            value={method.gateway_name}
                            style={{
                                width: '100%',
                                border: `2px solid ${selected === method.gateway_name ? '#1677ff' : '#e5e7eb'}`,
                                borderRadius: 10,
                                padding: '12px 16px',
                                transition: 'border-color 0.2s, box-shadow 0.2s',
                                boxShadow: selected === method.gateway_name
                                    ? '0 0 0 3px rgba(22, 119, 255, 0.10)'
                                    : 'none',
                                backgroundColor: selected === method.gateway_name ? '#f0f7ff' : '#fff',
                                cursor: 'pointer',
                            }}
                        >
                            <Space align="center" size={12}>
                                <Image
                                    src={method.logo_url || FALLBACK_LOGOS[method.gateway_name]}
                                    width={36}
                                    height={36}
                                    style={{ objectFit: 'contain', borderRadius: 6 }}
                                    preview={false}
                                    fallback={`data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><text y='28' font-size='28'>💳</text></svg>`}
                                />
                                <div>
                                    <Text strong>{method.display_name}</Text>
                                </div>
                            </Space>
                        </Radio>
                    ))}
                </Space>
            </Radio.Group>
        </div>
    );
};

export default GatewaySelector;
