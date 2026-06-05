import React, { useState } from 'react';
import { Card, Typography, Table, Button, Modal, Form, Input, Dropdown, Checkbox, Spin, message, Tag } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MasterDataSubPageLayout from '../../../components/common/MasterDataSubPageLayout';
import { attributeService } from '../../../api/services/attributeService';
import { profileService } from '../../../api/services/profileService';
import { materialService } from '../../../api/services/materialService';
import { Material, CreateMaterialPayload, UpdateMaterialPayload, MaterialAttribute } from '../../../types/material';
import { ensureArray } from '../../../utils/dataUtils';

const { Text, Title } = Typography;

const Materials: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const [editingRecord, setEditingRecord] = useState<Material | null>(null);

    // Get business ID from user profile
    const { data: profileResponse } = useQuery({
        queryKey: ['profile'],
        queryFn: profileService.getProfile,
    });

    const businessId = profileResponse?.output?.business?.id?.toString();

    // Load all materials
    const { data: materialsResponse, isLoading: isMaterialsLoading } = useQuery({
        queryKey: ['materials', businessId],
        queryFn: () => materialService.getAllMaterials(businessId!),
        enabled: !!businessId,
    });

    const materials = ensureArray<Material>(materialsResponse?.values);

    // Load available attributes for selection
    const { data: attributesResponse, isLoading: isAttributesLoading } = useQuery({
        queryKey: ['attributes', businessId],
        queryFn: () => attributeService.getAllAttributes(businessId!),
        enabled: !!businessId,
    });

    const attributeOptions = ensureArray<any>(attributesResponse?.values)?.map(attr => ({
        label: attr.name,
        value: attr.attribute_id,
    })) || [];

    // Save new material
    const createMutation = useMutation({
        mutationFn: (payload: CreateMaterialPayload) => materialService.createMaterial(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['materials', businessId] });
            message.success('Material created successfully');
            handleCancel();
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Failed to create material');
        }
    });

    // Update existing material
    const updateMutation = useMutation({
        mutationFn: (payload: UpdateMaterialPayload) => materialService.updateMaterial(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['materials', businessId] });
            message.success('Material updated successfully');
            handleCancel();
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Failed to update material');
        }
    });

    // Delete a material
    const deleteMutation = useMutation({
        mutationFn: (id: string) => materialService.deleteMaterial(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['materials', businessId] });
            message.success('Material deleted successfully');
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Failed to delete material');
        }
    });

    // Fill form when editing a material
    React.useEffect(() => {
        if (isModalOpen) {
            if (editingRecord) {
                form.setFieldsValue({
                    name: editingRecord.name,
                    description: editingRecord.description,
                    attributes: editingRecord.attributes?.map(a => a.attribute_id) || [],
                });
            } else {
                form.resetFields();
            }
        }
    }, [isModalOpen, editingRecord, form]);

    const handleAdd = () => {
        setEditingRecord(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record: Material) => {
        setEditingRecord(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this material?',
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
                    mat_id: editingRecord.mat_id,
                    name: values.name,
                    description: values.description,
                    attributes: values.attributes || []
                });
            } else if (businessId) {
                createMutation.mutate({
                    business_id: businessId,
                    name: values.name,
                    description: values.description,
                    attributes: values.attributes || []
                });
            }
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setEditingRecord(null);
    };

    const columns: ColumnsType<Material> = [
        { title: 'Material Name', dataIndex: 'name', key: 'name' },
        { title: 'Description', dataIndex: 'description', key: 'description', responsive: ['md'] },
        {
            title: 'Attributes',
            dataIndex: 'attributes',
            key: 'attributes',
            render: (attributes: MaterialAttribute[]) => (
                <div className="flex flex-wrap gap-1">
                    {attributes ? attributes.map(a => (
                        <Tag color="green" key={a.attribute_id}>{a.name}</Tag>
                    )) : '-'}
                </div>
            )
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
                            onClick: () => handleDelete(record.mat_id)
                        }
                    ]
                }} trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    return (
        <MasterDataSubPageLayout title="Materials" onAdd={handleAdd} addButtonText="Add Material">
            <div className="mb-6">
                <Text type="secondary">Manage raw materials and components.</Text>
            </div>

            <Card bordered={false} className="rounded-lg">
                <div className="mb-4">
                    <Title level={4}>Materials</Title>
                    <Text type="secondary">A list of all materials.</Text>
                </div>

                <Table
                    columns={columns}
                    dataSource={materials}
                    rowKey="mat_id"
                    loading={isMaterialsLoading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title={editingRecord ? "Edit Material" : "Add Material"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={editingRecord ? "Update" : "Create Material"}
                confirmLoading={createMutation.isPending || updateMutation.isPending}
                cancelText="Cancel"
                width={600}
            >
                <div className="mb-6">
                    <Text type="secondary">Create a new material for your products.</Text>
                </div>

                <Form form={form} layout="vertical" initialValues={{ attributes: [] }}>
                    <Form.Item
                        name="name"
                        label="Material Name"
                        rules={[{ required: true, message: 'Please input the material name!' }]}
                    >
                        <Input placeholder="Enter material name" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description (Optional)"
                    >
                        <Input.TextArea placeholder="Enter description" rows={3} />
                    </Form.Item>

                    <div className="mb-2">
                        <Text type="secondary" className="text-xs">Select the attributes that apply to this material.</Text>
                    </div>

                    <Form.Item
                        name="attributes"
                        label="Material Attributes"
                    >
                        {isAttributesLoading ? (
                            <Spin size="small" tip="Loading attributes..." />
                        ) : (
                            <Checkbox.Group
                                options={attributeOptions}
                                className="flex flex-col gap-2"
                            />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        </MasterDataSubPageLayout>
    );
};

export default Materials;
