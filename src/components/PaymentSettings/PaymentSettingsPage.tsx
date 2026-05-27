import React, { useEffect, useState } from 'react';
import {
    Row,
    Col,
    Card,
    Typography,
    Switch,
    Badge,
    Button,
    Modal,
    Form,
    Input,
    Select,
    InputNumber,
    message,
    Alert,
    Tooltip
} from 'antd';
import usePaymentSettings from '../../hooks/usePaymentSettings';
import type { GatewayName, SavePaymentSettingPayload } from '../../api/services/paymentSettingsService';

const { Title, Text } = Typography;
const { Option } = Select;

interface Props {
    businessId: string;
}

// ─── GATEWAY DEFINITIONS ────────────────────────────────────────────────────────

const GATEWAY_CONFIG: Record<GatewayName, {
    label: string;
    color: string;
    logo: string;
    fields: { key: string; label: string; placeholder: string; required: boolean }[];
}> = {
    stripe: {
        label: 'Stripe',
        color: '#635bff',
        logo: 'https://stripe.com/img/v3/home/social.png',
        fields: [
            { key: 'publishable_key', label: 'Publishable Key', placeholder: 'pk_live_*******xxxx', required: true },
            { key: 'secret_key', label: 'Secret Key', placeholder: 'sk_live_*******xxxx', required: true },
            { key: 'webhook_secret', label: 'Webhook Secret', placeholder: 'whsec_*******xxxx', required: true },
        ],
    },
    paypal: {
        label: 'PayPal',
        color: '#003087',
        logo: 'https://www.paypalobjects.com/webstatic/icon/pp258.png',
        fields: [
            { key: 'client_id', label: 'Client ID', placeholder: 'A21AA*******xxxx', required: true },
            { key: 'client_secret', label: 'Client Secret', placeholder: '***masked***', required: true },
        ],
    },
    payhere: {
        label: 'PayHere',
        color: '#2563eb',
        logo: 'https://www.payhere.lk/static/images/logo.png',
        fields: [
            { key: 'merchant_id', label: 'Merchant ID', placeholder: '123456', required: true },
            { key: 'merchant_secret', label: 'Merchant Secret', placeholder: '***masked***', required: true },
            { key: 'app_id', label: 'App ID (Optional)', placeholder: 'app_*******', required: false },
            { key: 'app_secret', label: 'App Secret (Optional)', placeholder: '***masked***', required: false },
        ],
    },
};

const PaymentSettingsPage: React.FC<Props> = ({ businessId }) => {
    const { settings, fetchSettings, saveSettings, toggleGateway } = usePaymentSettings();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeGateway, setActiveGateway] = useState<GatewayName | null>(null);
    const [saving, setSaving] = useState(false);

    const [form] = Form.useForm();

    useEffect(() => {
        if (businessId) {
            fetchSettings(businessId);
        }
    }, [businessId, fetchSettings]);

    const openConfigModal = (gateway: GatewayName) => {
        setActiveGateway(gateway);
        const setting = settings.find(s => s.gateway_name === gateway);

        // Clear previous values
        form.resetFields();

        // If setting exists, populate form
        if (setting) {
            form.setFieldsValue({
                environment: setting.environment || 'sandbox',
                display_order: setting.display_order ?? 0,
                // We set empty string for credentials so placeholders show the masked values,
                // and users can type fresh keys if they want to update them.
                credentials: Object.keys(setting.credentials || {}).reduce((acc, key) => ({ ...acc, [key]: '' }), {})
            });
        } else {
            form.setFieldsValue({
                environment: 'sandbox',
                display_order: 0,
            });
        }

        setIsModalOpen(true);
    };

    const closeConfigModal = () => {
        setIsModalOpen(false);
        setActiveGateway(null);
    };

    const handleSave = async (values: any) => {
        if (!activeGateway) return;

        setSaving(true);
        try {
            const payload: SavePaymentSettingPayload = {
                business_id: businessId,
                gateway_name: activeGateway,
                credentials: values.credentials || {},
                display_order: values.display_order || 0,
                environment: values.environment || 'sandbox',
                // Preserve is_active if it exists, otherwise default to true for new setups
                is_active: settings.find(s => s.gateway_name === activeGateway)?.is_active ?? true,
            };

            await saveSettings(payload);
            message.success(`${GATEWAY_CONFIG[activeGateway].label} configuration saved successfully.`);
            closeConfigModal();
        } catch (error: any) {
            // 422 errors handled automatically via axiosInstance interceptor by default,
            // but if we needed specific inline logic we could parse error.response.data.errors here.
        } finally {
            setSaving(false);
        }
    };

    const getWebhookUrl = (gateway: GatewayName) => {
        const baseUrl = process.env.REACT_APP_API_URL || process.env.VITE_API_BASE_URL || (window.location.origin + '/api');
        return `${baseUrl}/webhooks/${gateway}/${businessId}`;
    };

    const gateways: GatewayName[] = ['stripe', 'paypal', 'payhere'];

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 0' }}>
            <Title level={3}>Payment Settings</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                Configure payment methods for your checkout. You can have multiple active methods at once.
            </Text>

            <Row gutter={[24, 24]}>
                {gateways.map(gateway => {
                    const config = GATEWAY_CONFIG[gateway];
                    const setting = settings.find(s => s.gateway_name === gateway);
                    const isConfigured = !!setting;

                    return (
                        <Col xs={24} sm={12} md={8} key={gateway}>
                            <Card
                                hoverable
                                style={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderTop: `4px solid ${config.color}`,
                                    boxShadow: isConfigured ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                                }}
                                bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <img
                                        src={config.logo}
                                        alt={config.label}
                                        style={{ height: 40, width: 40, objectFit: 'contain', borderRadius: 8 }}
                                    />
                                    <Badge
                                        status={isConfigured ? 'success' : 'default'}
                                        text={isConfigured ? 'Configured' : 'Not Configured'}
                                    />
                                </div>

                                <Title level={5} style={{ marginTop: 0 }}>{config.label}</Title>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 16 }}>
                                    <Button type={isConfigured ? 'default' : 'primary'} onClick={() => openConfigModal(gateway)}>
                                        {isConfigured ? 'Edit Settings' : 'Configure'}
                                    </Button>

                                    {isConfigured && (
                                        <Tooltip title={setting.is_active ? 'Disable' : 'Enable'}>
                                            <Switch
                                                checked={setting.is_active}
                                                onChange={() => toggleGateway(setting.id!)}
                                            />
                                        </Tooltip>
                                    )}
                                </div>
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            {/* Configuration Modal */}
            <Modal
                title={`Configure ${activeGateway ? GATEWAY_CONFIG[activeGateway].label : ''}`}
                open={isModalOpen}
                onCancel={closeConfigModal}
                onOk={() => form.submit()}
                confirmLoading={saving}
                okText="Save Changes"
                destroyOnHidden
                width={600}
            >
                {activeGateway && (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSave}
                        requiredMark="optional"
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="environment" label="Mode">
                                    <Select>
                                        <Option value="sandbox">Sandbox / Test Mode</Option>
                                        <Option value="production">Live / Production Mode</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="display_order"
                                    label="Display Order (Checkout)"
                                    tooltip="Lower numbers appear first"
                                >
                                    <InputNumber style={{ width: '100%' }} min={0} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Alert
                            message="Webhook Integration"
                            description={
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                                    <Text copyable={{ text: getWebhookUrl(activeGateway) }} ellipsis style={{ flex: 1, backgroundColor: '#f0f0f0', padding: '4px 8px', borderRadius: 4 }}>
                                        {getWebhookUrl(activeGateway)}
                                    </Text>
                                </div>
                            }
                            type="info"
                            showIcon
                            style={{ marginBottom: 24 }}
                        />

                        <Typography.Title level={5}>API Credentials</Typography.Title>
                        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                            {settings.find(s => s.gateway_name === activeGateway)
                                ? 'Your existing keys are masked. Type a new key to update it, or leave blank to keep the existing one.'
                                : 'Enter your API credentials from your gateway dashboard.'}
                        </Text>

                        {GATEWAY_CONFIG[activeGateway].fields.map(field => {
                            const setting = settings.find(s => s.gateway_name === activeGateway);
                            const isConfigured = !!setting;
                            // Attempt to get masked placeholder if configured
                            let placeholder = field.placeholder;
                            if (isConfigured && setting.credentials?.[field.key as keyof typeof setting.credentials]) {
                                placeholder = setting.credentials[field.key as keyof typeof setting.credentials] as string;
                            }

                            return (
                                <Form.Item
                                    key={field.key}
                                    name={['credentials', field.key]}
                                    label={field.label}
                                    rules={[{ required: !isConfigured && field.required, message: `Please enter ${field.label}` }]}
                                >
                                    <Input.Password placeholder={placeholder} autoComplete="new-password" />
                                </Form.Item>
                            );
                        })}
                    </Form>
                )}
            </Modal>
        </div>
    );
};

export default PaymentSettingsPage;
