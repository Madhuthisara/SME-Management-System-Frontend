import React, { useState } from 'react';
import { Card, Typography, Table, Button, Modal, Form, Input, Dropdown, message } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MasterDataSubPageLayout from '../../../components/common/MasterDataSubPageLayout';
import { categoryService } from '../../../api/services/categoryService';
import { profileService } from '../../../api/services/profileService';
import { Category, CreateCategoryPayload, UpdateCategoryPayload } from '../../../types/category';

const { Text, Title } = Typography;

const ProductCategories: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const [editingRecord, setEditingRecord] = useState<Category | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Get business ID from user profile
    const { data: profileResponse } = useQuery({
        queryKey: ['profile'],
        queryFn: profileService.getProfile,
    });

    const businessId = profileResponse?.output?.business?.id?.toString();

    // Load available categories
    const { data: categoriesResponse, isLoading: isCategoriesLoading } = useQuery({
        queryKey: ['categories', businessId, page, pageSize],
        queryFn: () => categoryService.getAllCategories(businessId!, page, pageSize),
        enabled: !!businessId,
    });

    const categories = categoriesResponse?.output?.values || [];

    // Save new category
    const createMutation = useMutation({
        mutationFn: (payload: CreateCategoryPayload) => categoryService.createCategory(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories', businessId] });
            message.success('Category created successfully');
            handleCancel();
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Failed to create category');
        }
    });

    // Update existing category
    const updateMutation = useMutation({
        mutationFn: (payload: UpdateCategoryPayload) => categoryService.updateCategory(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories', businessId] });
            message.success('Category updated successfully');
            handleCancel();
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Failed to update category');
        }
    });

    // Delete a category
    const deleteMutation = useMutation({
        mutationFn: (id: string) => categoryService.deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories', businessId] });
            message.success('Category deleted successfully');
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Failed to delete category');
        }
    });

    // Fill form when editing
    React.useEffect(() => {
        if (isModalOpen) {
            if (editingRecord) {
                form.setFieldsValue({
                    name: editingRecord.name,
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

    const handleEdit = (record: Category) => {
        setEditingRecord(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this category?',
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
                    name: values.name,
                });
            } else if (businessId) {
                createMutation.mutate({
                    business_id: businessId,
                    name: values.name,
                });
            }
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setEditingRecord(null);
    };

    const columns: ColumnsType<Category> = [
        { title: 'Category Name', dataIndex: 'name', key: 'name' },
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
        <MasterDataSubPageLayout title="Product Categories" onAdd={handleAdd} addButtonText="Add Category">
            <div style={{ marginBottom: 24 }}><Text type="secondary">Manage categories for products.</Text></div>
            <Card bordered={false} style={{ borderRadius: 8 }}>
                <div style={{ marginBottom: 16 }}>
                    <Title level={4}>Categories</Title>
                    <Text type="secondary">A list of all product categories.</Text>
                </div>
                <Table
                    columns={columns}
                    dataSource={categories}
                    rowKey="id"
                    loading={isCategoriesLoading}
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: categoriesResponse?.output?.total_records || 0,
                        onChange: (newPage, newPageSize) => {
                            setPage(newPage);
                            setPageSize(newPageSize);
                        }
                    }}
                />
            </Card>
            <Modal
                title={editingRecord ? "Edit Category" : "Add Category"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={editingRecord ? "Update" : "Create"}
                confirmLoading={createMutation.isPending || updateMutation.isPending}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Category Name"
                        rules={[{ required: true, message: 'Please input the category name!' }]}
                    >
                        <Input placeholder="Enter category name" />
                    </Form.Item>
                </Form>
            </Modal>
        </MasterDataSubPageLayout>
    );
};

export default ProductCategories;
