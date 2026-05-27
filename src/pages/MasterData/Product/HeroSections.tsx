import React, { useState } from 'react';
import { Card, Typography, Table, Button, Modal, Form, Input, Dropdown, message, Upload, Switch, InputNumber } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MasterDataSubPageLayout from '../../../components/common/MasterDataSubPageLayout';
import { heroService, HeroSection, HeroSectionInput } from '../../../api/services/heroService';

const { Text, Title } = Typography;

const HeroSections: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const [editingRecord, setEditingRecord] = useState<HeroSection | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Load available hero sections
    const { data: heroes = [], isLoading: isHeroesLoading } = useQuery({
        queryKey: ['heroes'],
        queryFn: heroService.getAllHeroes,
    });

    // Save new hero section
    const createMutation = useMutation({
        mutationFn: (payload: HeroSectionInput) => heroService.createHero(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['heroes'] });
            message.success('Hero section created successfully');
            handleCancel();
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Failed to create hero section');
        }
    });

    // Update existing hero section
    const updateMutation = useMutation({
        mutationFn: (payload: { id: number | string, data: HeroSectionInput }) => heroService.updateHero(payload.id, payload.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['heroes'] });
            message.success('Hero section updated successfully');
            handleCancel();
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Failed to update hero section');
        }
    });

    // Delete a hero section
    const deleteMutation = useMutation({
        mutationFn: (id: number | string) => heroService.deleteHero(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['heroes'] });
            message.success('Hero section deleted successfully');
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Failed to delete hero section');
        }
    });

    // Fill form when editing
    React.useEffect(() => {
        if (isModalOpen) {
            if (editingRecord) {
                form.setFieldsValue({
                    title: editingRecord.title,
                    description: editingRecord.description,
                    button_text: editingRecord.button_text,
                    button_link: editingRecord.button_link,
                    order: editingRecord.order,
                    is_active: editingRecord.is_active,
                });
                setImageUrl(editingRecord.image_path);
            } else {
                form.resetFields();
                setImageUrl(null);
                form.setFieldsValue({ is_active: true, order: 0 }); // Default values
            }
        }
    }, [isModalOpen, editingRecord, form]);

    const handleAdd = () => {
        setEditingRecord(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record: HeroSection) => {
        setEditingRecord(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id: number | string) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this hero section?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => deleteMutation.mutate(id),
        });
    };

    const handleOk = () => {
        form.validateFields().then((values) => {
            if (!imageUrl) {
                message.error("Please upload an image.");
                return;
            }

            const payload: HeroSectionInput = {
                title: values.title || null,
                description: values.description || null,
                image_path: imageUrl,
                button_text: values.button_text || null,
                button_link: values.button_link || null,
                order: values.order || 0,
                is_active: values.is_active,
            };

            if (editingRecord) {
                updateMutation.mutate({
                    id: editingRecord.id,
                    data: payload,
                });
            } else {
                createMutation.mutate(payload);
            }
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setEditingRecord(null);
        setImageUrl(null);
    };

    const handleUpload = async (options: any) => {
        const { file, onSuccess, onError } = options;
        setIsUploading(true);
        try {
            const url = await heroService.uploadImage(file as File);
            setImageUrl(url);
            onSuccess("Ok");
            message.success('Image uploaded successfully');
        } catch (error) {
            onError(error);
            message.error('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const columns: ColumnsType<HeroSection> = [
        {
            title: 'Image',
            dataIndex: 'image_path',
            key: 'image_path',
            render: (url) => <img src={url} alt="Hero" style={{ width: 80, height: 40, objectFit: 'cover', borderRadius: 4 }} />
        },
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Order', dataIndex: 'order', key: 'order' },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (isActive) => (
                <Text type={isActive ? 'success' : 'danger'}>
                    {isActive ? 'Active' : 'Inactive'}
                </Text>
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
        <MasterDataSubPageLayout title="Hero Sections" onAdd={handleAdd} addButtonText="Add Hero Section">
            <div style={{ marginBottom: 24 }}><Text type="secondary">Manage the carousel images and descriptions on the e-store homepage.</Text></div>
            <Card bordered={false} style={{ borderRadius: 8 }}>
                <div style={{ marginBottom: 16 }}>
                    <Title level={4}>Hero Sections</Title>
                    <Text type="secondary">A list of all hero sections.</Text>
                </div>
                <Table
                    columns={columns}
                    dataSource={heroes}
                    rowKey="id"
                    loading={isHeroesLoading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>
            <Modal
                title={editingRecord ? "Edit Hero Section" : "Add Hero Section"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={editingRecord ? "Update" : "Create"}
                confirmLoading={createMutation.isPending || updateMutation.isPending || isUploading}
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Hero Image" required>
                        <Upload
                            customRequest={handleUpload}
                            showUploadList={false}
                            accept="image/*"
                        >
                            <Button icon={<UploadOutlined />} loading={isUploading}>Click to Upload</Button>
                        </Upload>
                        {imageUrl && (
                            <div style={{ marginTop: 16, position: 'relative', display: 'inline-block', width: '100%' }}>
                                <img src={imageUrl} alt="Uploaded Hero" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8 }} />
                                <Button
                                    type="primary"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => setImageUrl(null)}
                                    style={{ position: 'absolute', top: 8, right: 8 }}
                                    title="Remove Image"
                                />
                            </div>
                        )}
                    </Form.Item>

                    <Form.Item
                        name="title"
                        label="Hero Title"
                    >
                        <Input placeholder="Enter hero title" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Hero Description"
                    >
                        <Input.TextArea placeholder="Enter hero description" rows={3} />
                    </Form.Item>

                    <div style={{ display: 'flex', gap: 16 }}>
                        <Form.Item
                            name="button_text"
                            label="Button Text"
                            style={{ flex: 1 }}
                        >
                            <Input placeholder="e.g. Shop Now" />
                        </Form.Item>

                        <Form.Item
                            name="button_link"
                            label="Button Link"
                            style={{ flex: 1 }}
                        >
                            <Input placeholder="e.g. /products" />
                        </Form.Item>
                    </div>

                    <div style={{ display: 'flex', gap: 16 }}>
                        <Form.Item
                            name="order"
                            label="Display Order"
                            style={{ flex: 1 }}
                        >
                            <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            name="is_active"
                            label="Active Status"
                            valuePropName="checked"
                            style={{ flex: 1 }}
                        >
                            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </MasterDataSubPageLayout>
    );
};

export default HeroSections;
