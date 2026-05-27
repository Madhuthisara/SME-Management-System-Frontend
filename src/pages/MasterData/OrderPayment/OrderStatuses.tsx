import React, { useState } from 'react';
import { Card, Typography, Table, Button, Modal, Form, Input, Dropdown, ColorPicker, Tag, message, Spin } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MasterDataSubPageLayout from '../../../components/common/MasterDataSubPageLayout';
import { orderStatusService, OrderStatusData } from '../../../api/services/orderStatusService';
import { getLocalStorageData } from '../../../utils/storage';

const { Text, Title } = Typography;

const OrderStatuses: React.FC = () => {
    const queryClient = useQueryClient();
    const user = getLocalStorageData<any>('user') || {};
    const businessId = user.business_id;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<OrderStatusData | null>(null);
    const [form] = Form.useForm();

    const { data, isLoading } = useQuery({
        queryKey: ['order-statuses', businessId],
        queryFn: () => orderStatusService.getAll(businessId),
        enabled: !!businessId,
    });

    const createMutation = useMutation({
        mutationFn: orderStatusService.create,
        onSuccess: () => {
            message.success('Status created!');
            queryClient.invalidateQueries({ queryKey: ['order-statuses'] });
            setIsModalOpen(false);
            form.resetFields();
        },
        onError: (err: any) => {
            message.error(err?.response?.data?.message || 'Failed to create status.');
        },
    });

    const updateMutation = useMutation({
        mutationFn: orderStatusService.update,
        onSuccess: () => {
            message.success('Status updated!');
            queryClient.invalidateQueries({ queryKey: ['order-statuses'] });
            setIsModalOpen(false);
            form.resetFields();
            setEditingRecord(null);
        },
        onError: (err: any) => {
            message.error(err?.response?.data?.message || 'Failed to update status.');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: orderStatusService.delete,
        onSuccess: () => {
            message.success('Status deleted!');
            queryClient.invalidateQueries({ queryKey: ['order-statuses'] });
        },
        onError: (err: any) => {
            message.error(err?.response?.data?.message || 'Cannot delete: status is in use by orders.');
        },
    });

    const handleAdd = () => {
        setEditingRecord(null);
        form.resetFields();
        form.setFieldValue('color', '#1890ff');
        setIsModalOpen(true);
    };

    const handleEdit = (record: OrderStatusData) => {
        setEditingRecord(record);
        form.setFieldsValue({ name: record.name, color: record.color });
        setIsModalOpen(true);
    };

    const handleDelete = (record: OrderStatusData) => {
        Modal.confirm({
            title: 'Delete this status?',
            content: `"${record.name}" will be permanently deleted. This action cannot be undone.`,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => deleteMutation.mutate(record.id),
        });
    };

    const handleOk = () => {
        form.validateFields().then((values) => {
            const color = typeof values.color === 'string' ? values.color : values.color?.toHexString?.() ?? '#1890ff';
            if (editingRecord) {
                updateMutation.mutate({ id: editingRecord.id, name: values.name, color });
            } else {
                createMutation.mutate({ business_id: businessId, name: values.name, color });
            }
        });
    };

    const columns: ColumnsType<OrderStatusData> = [
        {
            title: 'Status Name',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, record: OrderStatusData) => (
                <Tag color={record.color} style={{ fontSize: 13, padding: '2px 10px' }}>{name}</Tag>
            ),
        },
        {
            title: 'Color',
            dataIndex: 'color',
            key: 'color',
            render: (color: string) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 4, backgroundColor: color, border: '1px solid #d9d9d9' }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>{color}</Text>
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 80,
            align: 'center',
            render: (_, record) => (
                <Dropdown menu={{
                    items: [
                        { key: 'edit', label: 'Edit', icon: <EditOutlined />, onClick: () => handleEdit(record) },
                        { key: 'delete', label: 'Delete', icon: <DeleteOutlined />, danger: true, onClick: () => handleDelete(record) },
                    ],
                }} trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    return (
        <MasterDataSubPageLayout title="Order Statuses" onAdd={handleAdd} addButtonText="Add Status">
            <div style={{ marginBottom: 24 }}><Text type="secondary">Define custom order lifecycle statuses for your business.</Text></div>
            <Card bordered={false} style={{ borderRadius: 8 }}>
                <div style={{ marginBottom: 16 }}>
                    <Title level={4}>Statuses</Title>
                    <Text type="secondary">All custom order statuses that can be assigned to orders.</Text>
                </div>
                {isLoading ? <Spin /> : (
                    <Table
                        columns={columns}
                        dataSource={data?.output?.values || []}
                        rowKey="id"
                        pagination={false}
                    />
                )}
            </Card>

            <Modal
                title={editingRecord ? 'Edit Status' : 'Add Status'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => { setIsModalOpen(false); form.resetFields(); setEditingRecord(null); }}
                okText={editingRecord ? 'Update' : 'Create'}
                confirmLoading={createMutation.isPending || updateMutation.isPending}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Status Name" rules={[{ required: true, message: 'Status name is required' }]}>
                        <Input placeholder="e.g. Packed, Dispatched, On Hold..." />
                    </Form.Item>
                    <Form.Item name="color" label="Badge Color" initialValue="#1890ff" rules={[{ required: true }]}>
                        <ColorPicker format="hex" showText />
                    </Form.Item>
                </Form>
            </Modal>
        </MasterDataSubPageLayout>
    );
};

export default OrderStatuses;
