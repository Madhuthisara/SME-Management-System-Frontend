import React, { useState } from 'react';
import { Card, Typography, Table, Button, Modal, Form, Input, Dropdown, Spin, message, Tag } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MasterDataSubPageLayout from '../../../components/common/MasterDataSubPageLayout';
import { attributeService } from '../../../api/services/attributeService';
import { profileService } from '../../../api/services/profileService';
import { Attribute, CreateAttributePayload, UpdateAttributePayload } from '../../../types/attribute';
import AttributeOptionsModal from './components/AttributeOptionsModal';
import { ensureArray } from '../../../utils/dataUtils';

const { Text, Title } = Typography;

const MaterialAttributes: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null);
    const [selectedAttribute, setSelectedAttribute] = useState<Attribute | null>(null);
    const queryClient = useQueryClient();

    // Get business ID from user profile
    const { data: profileResponse } = useQuery({
        queryKey: ['profile'],
        queryFn: profileService.getProfile,
    });

    const businessId = profileResponse?.output?.business?.id?.toString();

    // Load all attributes (options are included in the response)
    const { data: attributesResponse, isLoading: isFetching } = useQuery({
        queryKey: ['attributes', businessId],
        queryFn: () => attributeService.getAllAttributes(businessId!),
        enabled: !!businessId,
    });

    const attributes = ensureArray<Attribute>(attributesResponse?.values);

    // Save new attribute
    const createMutation = useMutation({
        mutationFn: (payload: CreateAttributePayload) => attributeService.createAttribute(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attributes', businessId] });
            message.success('Attribute created successfully');
            handleCancel();
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Failed to create attribute');
        }
    });

    // Update existing attribute
    const updateMutation = useMutation({
        mutationFn: (payload: UpdateAttributePayload) => attributeService.updateAttribute(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attributes', businessId] });
            message.success('Attribute updated successfully');
            handleCancel();
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Failed to update attribute');
        }
    });

    // Delete an attribute
    const deleteMutation = useMutation({
        mutationFn: (id: string) => attributeService.deleteAttribute(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attributes', businessId] });
            message.success('Attribute deleted successfully');
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Failed to delete attribute');
        }
    });

    const handleAdd = () => {
        setEditingAttribute(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (record: Attribute) => {
        setEditingAttribute(record);
        form.setFieldsValue({ name: record.name });
        setIsModalOpen(true);
    };

    const handleAddOptions = (record: Attribute) => {
        setSelectedAttribute(record);
        setIsOptionsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this attribute?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => {
                deleteMutation.mutate(id);
            },
        });
    };

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                if (editingAttribute) {
                    updateMutation.mutate({
                        attribute_id: editingAttribute.attribute_id,
                        name: values.name,
                    });
                } else {
                    if (businessId) {
                        createMutation.mutate({
                            business_id: businessId,
                            name: values.name,
                        });
                    }
                }
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setEditingAttribute(null);
    };

    const handleOptionsModalClose = () => {
        setIsOptionsModalOpen(false);
        // Refresh attributes to show updated options
        queryClient.invalidateQueries({ queryKey: ['attributes', businessId] });
    };

    const columns: ColumnsType<Attribute> = [
        {
            title: 'Attribute Name',
            dataIndex: 'name',
            key: 'name',
            width: '25%',
        },
        {
            title: 'Options',
            key: 'options',
            render: (_, record) => {
                const hasOptions = record.options && record.options.length > 0;

                return (
                    <div className="flex items-center flex-wrap gap-2">
                        {hasOptions ? (
                            <>
                                {record.options!.map(opt => (
                                    <Tag key={opt.option_id} color="blue">
                                        {opt.name}
                                    </Tag>
                                ))}
                                <Button
                                    type="dashed"
                                    size="small"
                                    icon={<PlusOutlined />}
                                    onClick={() => handleAddOptions(record)}
                                >
                                    Add
                                </Button>
                            </>
                        ) : (
                            <Button
                                type="dashed"
                                size="small"
                                icon={<PlusOutlined />}
                                onClick={() => handleAddOptions(record)}
                            >
                                Add Options
                            </Button>
                        )}
                    </div>
                );
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            align: 'center',
            render: (_, record) => {
                const items = [
                    {
                        key: 'edit',
                        label: 'Edit',
                        icon: <EditOutlined />,
                        onClick: () => handleEdit(record),
                    },
                    {
                        key: 'delete',
                        label: 'Delete',
                        icon: <DeleteOutlined />,
                        danger: true,
                        onClick: () => handleDelete(record.attribute_id),
                    },
                ];

                return (
                    <Dropdown menu={{ items }} trigger={['click']}>
                        <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                );
            },
        },
    ];

    return (
        <MasterDataSubPageLayout
            title="Material Attributes"
            onAdd={handleAdd}
            addButtonText="Add Attribute"
        >
            <div className="mb-6">
                <Text type="secondary">
                    Manage the attributes used for material variations.
                </Text>
            </div>

            <Card bordered={false} className="rounded-lg">
                <div className="mb-4">
                    <Title level={4}>Attributes</Title>
                    <Text type="secondary">A list of all material attributes.</Text>
                </div>
                {isFetching ? (
                    <div className="py-5 text-center">
                        <Spin tip="Loading attributes..." />
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={attributes}
                        rowKey={(record) => record.attribute_id || (record as any).id || (record as any).option_id || Math.random().toString()}
                        pagination={false}
                    />
                )}
            </Card>

            <Modal
                title={editingAttribute ? "Edit Attribute" : "Add Attribute"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={editingAttribute ? "Update" : "Create"}
                confirmLoading={createMutation.isPending || updateMutation.isPending}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    className="flex flex-col space-y-2"
                >
                    <div className="flex">Create a new attribute to be used across materials.</div>
                    <Form.Item
                        name="name"
                        label="Attribute Name"
                        rules={[{ required: true, message: 'Please input the name of the attribute!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            <AttributeOptionsModal
                attribute={selectedAttribute}
                open={isOptionsModalOpen}
                onClose={handleOptionsModalClose}
            />
        </MasterDataSubPageLayout>
    );
};

export default MaterialAttributes;
