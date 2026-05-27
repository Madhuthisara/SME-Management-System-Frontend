import React, { useState } from 'react';
import { Form, Input, Select, InputNumber, Button, Space, Divider, Typography, Row, Col, Card } from 'antd';
import { MinusCircleOutlined, PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { OrderSource, CreateOrderPayload, PaymentMethod } from '../../types/order';
import { Product } from '../../types/product';
import { productService } from '../../api/services/productService';
import { OrderStatusData } from '../../api/services/orderStatusService';

const { Text } = Typography;
const { Option } = Select;

interface OrderFormProps {
    products: Product[];
    orderStatuses?: OrderStatusData[];
    onSubmit: (values: CreateOrderPayload) => void;
    loading?: boolean;
}

const OrderForm: React.FC<OrderFormProps> = ({ products, orderStatuses = [], onSubmit, loading }) => {
    const [form] = Form.useForm();
    const [productAttributes, setProductAttributes] = useState<Record<number, any[]>>({});
    const [fetchingAttributes, setFetchingAttributes] = useState<Record<number, boolean>>({});

    const onFinish = (values: any) => {
        const payload: CreateOrderPayload = {
            customer_name: values.customer_name,
            phone_number: values.phone_number,
            secondary_phone_number: values.secondary_phone_number,
            delivery_address: values.delivery_address,
            district: values.district,
            nearest_main_city: values.nearest_main_city,
            source: values.source,
            payment_method: values.payment_method,
            notes: values.notes,
            custom_status_id: values.custom_status_id || undefined,
            items: values.items.map((item: any) => {
                // Collect all selected option IDs from the attributes object
                const attributeOptionIds = item.attributes ? Object.values(item.attributes) : [];
                return {
                    product_id: item.product_id,
                    attribute_option_ids: attributeOptionIds,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                };
            }),
        };
        onSubmit(payload);
    };

    const handleProductChange = async (productId: string, name: number) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            const items = form.getFieldValue('items');
            items[name].unit_price = parseFloat(product.base_price);
            items[name].attributes = {}; // Reset attributes
            form.setFieldsValue({ items });

            setFetchingAttributes(prev => ({ ...prev, [name]: true }));
            try {
                const response = await productService.getRequiredAttributes(productId);
                if (response.success) {
                    // Filter out redundant attributes like Design and Placement for the Order Form
                    const filteredAttributes = response.output.filter((attr: any) => {
                        const name = attr.name.toLowerCase();
                        return !name.includes('design') && !name.includes('placement') && !name.includes('logo');
                    });
                    setProductAttributes(prev => ({ ...prev, [name]: filteredAttributes }));
                }
            } catch (error) {
                console.error('Failed to fetch required attributes:', error);
            } finally {
                setFetchingAttributes(prev => ({ ...prev, [name]: false }));
            }
        }
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ items: [{}] }}
        >
            <Card title="Customer Information" size="small" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="customer_name" label="Customer Name" rules={[{ required: true }]}>
                            <Input placeholder="Enter customer name" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="phone_number" label="Primary Phone" rules={[{ required: true }]}>
                            <Input placeholder="07XXXXXXXX" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="secondary_phone_number" label="Secondary Phone">
                            <Input placeholder="07XXXXXXXX (Optional)" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="delivery_address" label="Delivery Address" rules={[{ required: true }]}>
                            <Input.TextArea rows={2} placeholder="No, Street, City" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="district" label="District" rules={[{ required: true }]}>
                            <Input placeholder="e.g. Galle" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="nearest_main_city" label="Nearest Main City" rules={[{ required: true }]}>
                            <Input placeholder="e.g. Galle City" />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>

            <Card title="Payment & Source" size="small" style={{ marginBottom: 16 }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="source" label="Order Source" rules={[{ required: true }]}>
                            <Select placeholder="Select source">
                                <Option value={OrderSource.WHATSAPP}>WhatsApp</Option>
                                <Option value={OrderSource.FACEBOOK}>Facebook</Option>
                                <Option value={OrderSource.INSTAGRAM}>Instagram</Option>
                                <Option value={OrderSource.WALK_IN}>Walk-in</Option>
                                <Option value={OrderSource.OTHER}>Other</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="payment_method" label="Payment Method" rules={[{ required: true }]}>
                            <Select placeholder="Select method">
                                <Option value={PaymentMethod.COD}>Cash on Delivery</Option>
                                <Option value={PaymentMethod.BANK_TRANSFER}>Bank Transfer</Option>
                                <Option value={PaymentMethod.ONLINE}>Online Payment</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item name="notes" label="Notes">
                    <Input.TextArea rows={2} placeholder="Any special instructions..." />
                </Form.Item>
                {orderStatuses.length > 0 && (
                    <Form.Item name="custom_status_id" label="Custom Status (Optional)">
                        <Select placeholder="Assign a custom status" allowClear>
                            {orderStatuses.map(s => (
                                <Option key={s.id} value={s.id}>
                                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', backgroundColor: s.color, marginRight: 8 }} />
                                    {s.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}
            </Card>

            <Divider>Order Items</Divider>

            <Form.List name="items">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Card key={key} size="small" style={{ marginBottom: 12, backgroundColor: '#fafafa' }}>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Row gutter={12} align="top">
                                        <Col span={10}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'product_id']}
                                                label="Product"
                                                rules={[{ required: true, message: 'Missing product' }]}
                                            >
                                                <Select
                                                    showSearch
                                                    placeholder="Select product"
                                                    optionFilterProp="children"
                                                    onChange={(val) => handleProductChange(val, name)}
                                                >
                                                    {products.map(p => (
                                                        <Option key={p.id} value={p.id}>{p.name}</Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'quantity']}
                                                label="Qty"
                                                rules={[{ required: true, message: 'Missing qty' }]}
                                            >
                                                <InputNumber min={1} style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'unit_price']}
                                                label="Price"
                                                rules={[{ required: true, message: 'Missing price' }]}
                                            >
                                                <InputNumber min={0} style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={2}>
                                            <Button type="text" danger onClick={() => remove(name)} icon={<MinusCircleOutlined />} style={{ marginTop: 30 }} />
                                        </Col>
                                    </Row>

                                    {/* Dynamic Attributes (Size, Color, etc.) */}
                                    {fetchingAttributes[name] && <Text type="secondary">Loading options...</Text>}
                                    {productAttributes[name] && productAttributes[name].length > 0 && (
                                        <Row gutter={12}>
                                            {productAttributes[name].map((attr) => (
                                                <Col key={attr.attribute_id} span={Math.floor(24 / productAttributes[name].length)}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'attributes', attr.attribute_id]}
                                                        label={attr.name}
                                                        rules={[{ required: true, message: `Select ${attr.name}` }]}
                                                    >
                                                        <Select placeholder={`Select ${attr.name}`}>
                                                            {attr.options.map((opt: any) => (
                                                                <Option key={opt.option_id} value={opt.option_id}>
                                                                    {opt.name}
                                                                </Option>
                                                            ))}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                            ))}
                                        </Row>
                                    )}
                                </Space>
                            </Card>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add Item
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                    icon={<ShoppingCartOutlined />}
                    size="large"
                    style={{ backgroundColor: '#00b96b', height: 50, borderRadius: 8 }}
                >
                    Create Order
                </Button>
            </Form.Item>
        </Form>
    );
};

export default OrderForm;
