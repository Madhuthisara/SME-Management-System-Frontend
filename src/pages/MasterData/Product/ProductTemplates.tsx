import React, { useState } from 'react';
import { Card, Typography, Table, Button, Modal, Form, Input, Dropdown, message, Row, Col, Select, InputNumber, Divider } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, PlusOutlined, DeleteFilled } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MasterDataSubPageLayout from '../../../components/common/MasterDataSubPageLayout';
import { profileService } from '../../../api/services/profileService';
import { materialService } from '../../../api/services/materialService';
import { productTemplateService } from '../../../api/services/productTemplateService';
import { ProductTemplate, BOMItem } from '../../../types/productTemplate';

const { Text, Title } = Typography;
const { Option } = Select;

const ProductTemplates: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const [editingRecord, setEditingRecord] = useState<ProductTemplate | null>(null);

    // Get business ID from user profile
    const { data: profileResponse } = useQuery({
        queryKey: ['profile'],
        queryFn: profileService.getProfile,
    });

    const businessId = profileResponse?.output?.business?.id?.toString();

    // Load all templates from backend
    const { data: templatesResponse, isLoading: isTemplatesLoading } = useQuery({
        queryKey: ['product-templates', businessId],
        queryFn: () => productTemplateService.getAllTemplates(businessId!),
        enabled: !!businessId,
    });

    const templates = templatesResponse?.output?.values || [];

    // Load available materials for selection
    const { data: materialsResponse, isLoading: isMaterialsLoading } = useQuery({
        queryKey: ['materials', businessId],
        queryFn: () => materialService.getAllMaterials(businessId!),
        enabled: !!businessId,
    });

    const materials = materialsResponse?.output?.values || [];

    // CRUD Mutations
    const createMutation = useMutation({
        mutationFn: (payload: any) => productTemplateService.createTemplate(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-templates', businessId] });
            message.success('Product template created successfully');
            handleCancel();
        },
    });

    const updateMutation = useMutation({
        mutationFn: (payload: any) => productTemplateService.updateTemplate(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-templates', businessId] });
            message.success('Product template updated successfully');
            handleCancel();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => productTemplateService.deleteTemplate(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-templates', businessId] });
            message.success('Product template deleted successfully');
        },
    });

    // Handle form filling for edit
    React.useEffect(() => {
        if (isModalOpen) {
            if (editingRecord) {
                // Ensure materials are in the correct format for Form.List
                const formattedMaterials = editingRecord.materials?.map(m => ({
                    material_id: m.material_id,
                    quantity: m.quantity
                })) || [{}];

                form.setFieldsValue({
                    name: editingRecord.name,
                    materials: formattedMaterials,
                    primary_material_id: editingRecord.primary_material_id,
                });
            } else {
                form.resetFields();
                form.setFieldsValue({ materials: [{}] });
            }
        }
    }, [isModalOpen, editingRecord, form]);

    const handleAdd = () => {
        setEditingRecord(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record: ProductTemplate) => {
        setEditingRecord(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this template?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => deleteMutation.mutate(id),
        });
    };

    const handleOk = () => {
        form.validateFields().then((values) => {
            if (editingRecord) {
                updateMutation.mutate({
                    id: editingRecord.id,
                    ...values,
                });
            } else if (businessId) {
                createMutation.mutate({
                    business_id: businessId,
                    ...values,
                });
            }
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setEditingRecord(null);
    };

    // Watch materials to populate primary material dropdown
    const formMaterials = Form.useWatch('materials', form);
    const selectedMaterialIds = formMaterials?.map((m: BOMItem) => m.material_id).filter(Boolean) || [];
    const availablePrimaryMaterials = materials.filter(m => selectedMaterialIds.includes(m.mat_id));

    const columns: ColumnsType<ProductTemplate> = [
        { title: 'Template Name', dataIndex: 'name', key: 'name' },
        {
            title: 'Materials Count',
            key: 'materials_count',
            render: (_, record) => record.materials?.length || 0,
        },
        {
            title: 'Actions', key: 'actions', width: 100, align: 'center',
            render: (_, record) => (
                <Dropdown menu={{
                    items: [
                        {
                            key: 'edit',
                            label: 'Edit',
                            icon: <EditOutlined />,
                            onClick: () => handleEdit(record)
                        },
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
        <MasterDataSubPageLayout title="Product Templates" onAdd={handleAdd} addButtonText="Add Template">
            <div style={{ marginBottom: 24 }}><Text type="secondary">Define reusable product structures (BOMs).</Text></div>
            <Card bordered={false} style={{ borderRadius: 8 }}>
                <div style={{ marginBottom: 16 }}><Title level={4}>Templates</Title><Text type="secondary">A list of all product templates.</Text></div>
                <Table
                    columns={columns}
                    dataSource={templates}
                    rowKey="id"
                    loading={isTemplatesLoading || isMaterialsLoading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title={
                    <div style={{ paddingBottom: 8 }}>
                        <Title level={4} style={{ margin: 0 }}>{editingRecord ? "Edit Product Template" : "Add Product Template"}</Title>
                        <Text type="secondary" style={{ fontSize: '13px', fontWeight: 400 }}>
                            {editingRecord ? "Edit the Bill of Materials (BOM) template." : "Create a new Bill of Materials (BOM) template."}
                        </Text>
                    </div>
                }
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel} style={{ borderRadius: 6 }}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={handleOk}
                        style={{ borderRadius: 6, backgroundColor: '#3f51b5' }}
                        loading={createMutation.isPending || updateMutation.isPending}
                    >
                        {editingRecord ? "Update Template" : "Create Template"}
                    </Button>,
                ]}
                width={700}
                centered
                bodyStyle={{ maxHeight: '70vh', overflowY: 'auto', padding: '24px' }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label={<Text strong>Template Name</Text>}
                        rules={[{ required: true, message: 'Please enter a template name' }]}
                    >
                        <Input placeholder="e.g., Standard T-Shirt BOM" size="large" style={{ borderRadius: 6 }} />
                    </Form.Item>

                    <Divider style={{ margin: '12px 0 24px 0' }} />

                    <div style={{ marginBottom: 16 }}>
                        <Text strong style={{ fontSize: '16px' }}>Materials (BOM)</Text><br />
                        <Text type="secondary" style={{ fontSize: '13px' }}>Add the materials required to create a product from this template.</Text>
                    </div>

                    <Form.List name="materials">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <div
                                        key={key}
                                        style={{
                                            background: '#f9f9f9',
                                            padding: '16px',
                                            borderRadius: '8px',
                                            marginBottom: '12px',
                                            border: '1px solid #f0f0f0',
                                            position: 'relative'
                                        }}
                                    >
                                        <Row gutter={16} align="bottom">
                                            <Col span={14}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'material_id']}
                                                    label={<Text style={{ fontSize: '12px', fontWeight: 600 }}>Material</Text>}
                                                    rules={[{ required: true, message: 'Select material' }]}
                                                    style={{ marginBottom: 0 }}
                                                >
                                                    <Select
                                                        placeholder="Select a material"
                                                        loading={isMaterialsLoading}
                                                        size="large"
                                                        style={{ borderRadius: 6 }}
                                                    >
                                                        {materials.map(m => (
                                                            <Option key={m.mat_id} value={m.mat_id}>{m.name}</Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={7}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'quantity']}
                                                    label={<Text style={{ fontSize: '12px', fontWeight: 600 }}>Required Qty</Text>}
                                                    rules={[{ required: true, message: 'Enter qty' }]}
                                                    style={{ marginBottom: 0 }}
                                                    initialValue={1}
                                                >
                                                    <InputNumber min={0.0001} size="large" style={{ width: '100%', borderRadius: 6 }} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={3} style={{ display: 'flex', justifyContent: 'center' }}>
                                                <Button
                                                    type="primary"
                                                    danger
                                                    icon={<DeleteFilled />}
                                                    onClick={() => remove(name)}
                                                    style={{ borderRadius: 6, height: 40, width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                />
                                            </Col>
                                        </Row>
                                    </div>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        block
                                        icon={<PlusOutlined />}
                                        style={{ height: 45, borderRadius: 8, marginTop: 8 }}
                                    >
                                        Add Another Material
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                    <Divider style={{ margin: '24px 0' }} />

                    <Form.Item
                        name="primary_material_id"
                        label={<Text strong>Primary Material</Text>}
                        extra={<Text type="secondary" style={{ fontSize: '12px' }}>This is the main material used to identify the product variant in the stock list.</Text>}
                    >
                        <Select
                            placeholder="Select the main material"
                            size="large"
                            style={{ borderRadius: 6 }}
                            disabled={availablePrimaryMaterials.length === 0}
                            allowClear
                        >
                            {availablePrimaryMaterials.map(m => (
                                <Option key={m.mat_id} value={m.mat_id}>{m.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </MasterDataSubPageLayout>
    );
};

export default ProductTemplates;
