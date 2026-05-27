import React, { useState } from 'react';
import { Typography, Table, Button, Modal, Form, Input, Dropdown, Select, Row, Col, InputNumber, Divider, message, Space, Tag } from 'antd';
import { MoreOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MasterDataSubPageLayout from '../../../components/common/MasterDataSubPageLayout';
import { profileService } from '../../../api/services/profileService';
import { productStockService } from '../../../api/services/productStockService';
import { materialStockService } from '../../../api/services/materialStockService';
import { productService } from '../../../api/services/productService';
import { ProductStock } from '../../../types/productStock';

const { Text, Title } = Typography;
const { Option } = Select;

const ProductStocks: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const [productAttributes, setProductAttributes] = useState<any[]>([]);
    const [fetchingAttributes, setFetchingAttributes] = useState(false);
    const [selectedAttributeOptions, setSelectedAttributeOptions] = useState<Record<string, string>>({});

    // Get business ID
    const { data: profileResponse } = useQuery({
        queryKey: ['profile'],
        queryFn: profileService.getProfile,
    });
    const businessId = profileResponse?.output?.business?.id?.toString();

    // Queries
    const { data: stocksResponse, isLoading: isStocksLoading } = useQuery({
        queryKey: ['product-stocks', businessId],
        queryFn: () => productStockService.getAllStocks(businessId!),
        enabled: !!businessId,
    });

    const { data: productsResponse } = useQuery({
        queryKey: ['products', businessId],
        queryFn: () => productService.getAllProducts(businessId!),
        enabled: !!businessId,
    });

    const { data: materialStocksResponse } = useQuery({
        queryKey: ['material-stocks', businessId],
        queryFn: () => materialStockService.getAllMaterialStocks(businessId!),
        enabled: !!businessId,
    });

    const stocks = stocksResponse?.output?.values || [];
    const products = productsResponse?.output?.values || [];
    const materialStocks = materialStocksResponse?.output?.values || [];

    // Watchers
    const selectedProductId = Form.useWatch('product_id', form);
    const selectedProduct = (products as any[]).find(p => p.id === selectedProductId);
    const selectedTemplate = selectedProduct?.product_template;

    // Mutation
    const createMutation = useMutation({
        mutationFn: (payload: any) => productStockService.createStock(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-stocks', businessId] });
            queryClient.invalidateQueries({ queryKey: ['material-stocks', businessId] });
            message.success('Product stock added and materials deducted.');
            handleCancel();
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Failed to add product stock');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => productStockService.deleteStock(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-stocks', businessId] });
            message.success('Product stock entry deleted.');
        },
    });

    const handleAdd = () => {
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setProductAttributes([]);
        setSelectedAttributeOptions({});
    };

    const handleOk = () => {
        form.validateFields().then((values) => {
            if (businessId) {
                const materialsPayload = Object.entries(values.variants || {}).map(([materialId, materialStockId]) => ({
                    material_id: materialId,
                    material_stock_id: materialStockId,
                }));

                createMutation.mutate({
                    business_id: businessId,
                    product_id: values.product_id,
                    batch_id: values.batch_id,
                    quantity: values.quantity,
                    reorder_level: values.reorder_level,
                    notes: values.notes,
                    materials: materialsPayload,
                    attribute_option_ids: Object.values(selectedAttributeOptions),
                });
            }
        });
    };

    const handleProductChangeLocal = async (productId: string) => {
        setFetchingAttributes(true);
        setSelectedAttributeOptions({});
        form.setFieldsValue({
            variants: undefined // Clear material variants when product changes
        });
        try {
            const response = await productService.getRequiredAttributes(productId);
            if (response.success) {
                setProductAttributes(response.output);
            }
        } catch (error) {
            console.error('Failed to fetch required attributes:', error);
        } finally {
            setFetchingAttributes(false);
        }
    };

    const handleAttributeSelect = (attributeId: string, optionId: string) => {
        setSelectedAttributeOptions(prev => ({
            ...prev,
            [attributeId]: optionId
        }));
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Delete this stock entry?',
            okText: 'Yes',
            okType: 'danger',
            onOk: () => deleteMutation.mutate(id),
        });
    };

    const columns: ColumnsType<ProductStock> = [
        {
            title: 'Product (Design)',
            key: 'product',
            render: (_, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{record.product?.name || 'N/A'}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.product?.sku}</Text>
                </Space>
            )
        },
        {
            title: 'Attributes',
            key: 'attributes',
            render: (_, record) => (
                <Space size={[0, 4]} wrap>
                    {record.attribute_options?.map((opt: any) => (
                        <Tag color="blue" key={opt.id} style={{ fontSize: '11px' }}>
                            <Text strong style={{ fontSize: '10px' }}>{opt.attribute?.name?.toUpperCase()}: </Text>
                            {opt.name}
                        </Tag>
                    ))}
                    {(!record.attribute_options || record.attribute_options.length === 0) && <Text type="secondary">-</Text>}
                </Space>
            )
        },
        {
            title: 'Batch / Design',
            dataIndex: 'batch_id',
            key: 'batch_id',
            render: (batch) => batch ? <Text>{batch}</Text> : <Text type="secondary">-</Text>
        },
        { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Re-order Level', dataIndex: 'reorder_level', key: 'reorder_level' },
        {
            title: 'Actions', key: 'actions', width: 80, align: 'center',
            render: (_, record) => (
                <Dropdown menu={{
                    items: [
                        {
                            key: 'delete',
                            label: 'Delete',
                            icon: <DeleteOutlined />,
                            danger: true,
                            onClick: () => handleDelete(record.id)
                        }
                    ]
                }} trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    return (
        <MasterDataSubPageLayout
            title="Product Stock"
            onAdd={handleAdd}
            addButtonText="Add Product Stock"
        >
            <Table
                columns={columns}
                dataSource={stocks}
                loading={isStocksLoading}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title="Add Finished Product Stock"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={700}
                confirmLoading={createMutation.isPending}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item name="product_id" label="Design / Product" rules={[{ required: true }]}>
                                <Select
                                    placeholder="Select a product design"
                                    onChange={handleProductChangeLocal}
                                >
                                    {products.map((p: any) => (
                                        <Option key={p.id} value={p.id}>{p.name} ({p.sku})</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Dynamic Attributes Section */}
                    {productAttributes.length > 0 && (
                        <div style={{ background: '#f0f5ff', padding: '16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #adc6ff' }}>
                            <Title level={5} style={{ marginTop: 0 }}>Product Attributes (Finished Good Specifics)</Title>
                            <Text type="secondary">Define the specific size, color, etc., for this stock batch.</Text>
                            <Divider style={{ margin: '12px 0' }} />
                            <Row gutter={16}>
                                {productAttributes.map((attr) => (
                                    <Col key={attr.attribute_id} span={12}>
                                        <Form.Item
                                            label={attr.name}
                                            required
                                        >
                                            <Select
                                                placeholder={`Select ${attr.name}`}
                                                onChange={(val) => handleAttributeSelect(attr.attribute_id, val)}
                                            >
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
                        </div>
                    )}
                    {fetchingAttributes && <div style={{ marginBottom: 16 }}><Text type="secondary">Loading product requirements...</Text></div>}

                    {selectedTemplate && (
                        <div style={{ background: '#f9f9f9', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
                            <Title level={5} style={{ marginTop: 0 }}>Production Materials (BOM)</Title>
                            <Text type="secondary">Select the specific material variants used for this production run.</Text>
                            <Divider style={{ margin: '12px 0' }} />

                            {selectedTemplate.materials?.map((mat: any) => {
                                const availableStocks = materialStocks.filter((s: any) => s.material_id === mat.material_id);
                                return (
                                    <Form.Item
                                        key={mat.material_id}
                                        name={['variants', mat.material_id]}
                                        label={`${mat.material?.name} (Needs ${mat.quantity} units)`}
                                        rules={[{ required: true, message: 'Please select a variant' }]}
                                    >
                                        <Select placeholder="Select variant (Size/Color)">
                                            {availableStocks.map((s: any) => (
                                                <Option key={s.stock_id} value={s.stock_id}>
                                                    {s.attribute_options?.map((opt: any) => opt.name).join(' - ') || 'Default'}
                                                    (Available: {s.quantity})
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                );
                            })}
                        </div>
                    )}

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="quantity" label="Quantity Produced" rules={[{ required: true }]}>
                                <InputNumber min={1} style={{ width: '100% ' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="reorder_level" label="Re-order Level" initialValue={5}>
                                <InputNumber min={0} style={{ width: '100% ' }} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item name="batch_id" label="Batch ID / Design Name">
                                <Input placeholder="e.g., Batch-001 or Sigiri-Large" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item name="notes" label="Production Notes">
                                <Input.TextArea rows={2} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </MasterDataSubPageLayout>
    );
};

export default ProductStocks;
