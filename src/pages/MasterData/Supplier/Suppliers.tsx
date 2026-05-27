import React, { useState } from 'react';
import { Button, Card, Col, Form, Input, Layout, Modal, Row, Table, Typography, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PhoneOutlined, MailOutlined, BankOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supplierService } from '../../../api/services/supplierService';
import { profileService } from '../../../api/services/profileService';
import { Supplier, CreateSupplierPayload, UpdateSupplierPayload } from '../../../types/supplier';
import { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

const SuppliersPage: React.FC = () => {
    const queryClient = useQueryClient();

    // Get business ID from user profile
    const { data: profileResponse } = useQuery({
        queryKey: ['profile'],
        queryFn: profileService.getProfile,
    });

    const businessId = profileResponse?.output?.business?.id?.toString();

    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState<Supplier | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);

    const { data: suppliersResponse, isLoading } = useQuery({
        queryKey: ['suppliers', businessId, page, pageSize],
        queryFn: () => supplierService.getAllSuppliers(businessId!, page, pageSize),
        enabled: !!businessId,
    });

    const createMutation = useMutation({
        mutationFn: (payload: CreateSupplierPayload) => supplierService.createSupplier(payload),
        onSuccess: () => {
            message.success('Supplier created successfully');
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            handleCancel();
        },
        onError: (error: any) => {
            message.error(error?.response?.data?.message || 'Failed to create supplier');
        },
    });

    const updateMutation = useMutation({
        mutationFn: (payload: UpdateSupplierPayload) => supplierService.updateSupplier(payload),
        onSuccess: () => {
            message.success('Supplier updated successfully');
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
            handleCancel();
        },
        onError: (error: any) => {
            message.error(error?.response?.data?.message || 'Failed to update supplier');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (supplierId: string) => supplierService.deleteSupplier(supplierId),
        onSuccess: () => {
            message.success('Supplier deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['suppliers'] });
        },
        onError: (error: any) => {
            message.error(error?.response?.data?.message || 'Failed to delete supplier');
        },
    });

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingRecord(null);
        form.resetFields();
    };

    const handleEdit = (record: Supplier) => {
        setEditingRecord(record);
        form.setFieldsValue({
            name: record.name,
            contact_person: record.contact_person,
            phone: record.phone,
            email: record.email,
            address: record.address,
        });
        showModal();
    };

    const onFinish = (values: Omit<CreateSupplierPayload, 'business_id'>) => {
        const payload = {
            ...values,
            business_id: businessId!,
        };

        if (editingRecord) {
            updateMutation.mutate({ ...payload, id: (editingRecord.supplier_id || editingRecord.id)! });
        } else {
            createMutation.mutate(payload);
        }
    };

    const columns: ColumnsType<Supplier> = [
        {
            title: 'Supplier Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <Text strong><BankOutlined className="mr-2" />{text}</Text>,
        },
        {
            title: 'Contact Person',
            dataIndex: 'contact_person',
            key: 'contact_person',
            render: (text) => text || '-',
        },
        {
            title: 'Contact Details',
            key: 'contact',
            render: (_, record) => (
                <div className="flex flex-col gap-1">
                    {record.phone && <Text type="secondary"><PhoneOutlined className="mr-2" />{record.phone}</Text>}
                    {record.email && <Text type="secondary"><MailOutlined className="mr-2" />{record.email}</Text>}
                    {!record.phone && !record.email && '-'}
                </div>
            ),
        },
        {
            title: 'Location',
            dataIndex: 'address',
            key: 'address',
            width: '30%',
            render: (text) => text ? <><EnvironmentOutlined className="mr-2" />{text}</> : '-',
        },
        {
            title: 'Action',
            key: 'action',
            className: 'text-right',
            render: (_, record) => (
                <div className="flex justify-end gap-2">
                    <Button type="default" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm
                        title="Delete Supplier"
                        description="Are you sure to delete this supplier?"
                        onConfirm={() => deleteMutation.mutate((record.supplier_id || record.id)!)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            ),
        }
    ];

    return (
        <Layout className="bg-transparent h-full max-h-screen custom-scrollbar p-6">
            <Row justify="space-between" align="middle" className="mb-6">
                <Col>
                    <Title level={2} className="m-0 text-navy-800">
                        Suppliers
                    </Title>
                    <Text type="secondary" className="text-gray-500">
                        Manage your suppliers and their contact details.
                    </Text>
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={showModal} size="large" className="bg-navy-600 shadow-md">
                        Add Supplier
                    </Button>
                </Col>
            </Row>

            <Card className="shadow-sm border-gray-200">
                <Table
                    columns={columns}
                    dataSource={suppliersResponse?.output?.values || []}
                    rowKey={(record) => record.supplier_id || record.id || Math.random().toString()}
                    loading={isLoading || deleteMutation.isPending}
                    className="custom-table"
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: suppliersResponse?.output?.total_records || 0,
                        onChange: (newPage, newPageSize) => {
                            setPage(newPage);
                            setPageSize(newPageSize);
                        },
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} suppliers`,
                    }}
                />
            </Card>

            <Modal
                title={editingRecord ? 'Edit Supplier' : 'Add Supplier'}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                className="custom-modal"
                centered
            >
                <Form form={form} layout="vertical" onFinish={onFinish} className="mt-4">
                    <Form.Item
                        name="name"
                        label="Supplier Name / Company Name"
                        rules={[{ required: true, message: 'Please input the supplier name!' }]}
                    >
                        <Input placeholder="Enter supplier name" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="contact_person"
                        label="Contact Person"
                    >
                        <Input placeholder="Enter contact person name (optional)" size="large" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="phone"
                                label="Phone Number"
                            >
                                <Input placeholder="Enter phone" size="large" prefix={<PhoneOutlined className="text-gray-400" />} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email Address"
                                rules={[{ type: 'email', message: 'Please enter a valid email!' }]}
                            >
                                <Input placeholder="Enter email" size="large" prefix={<MailOutlined className="text-gray-400" />} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="address"
                        label="Address"
                    >
                        <Input.TextArea placeholder="Enter address (optional)" rows={3} />
                    </Form.Item>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button onClick={handleCancel} size="large">Cancel</Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={createMutation.isPending || updateMutation.isPending}
                            className="bg-navy-600"
                            size="large"
                        >
                            {editingRecord ? 'Update Supplier' : 'Save Supplier'}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </Layout>
    );
};

export default SuppliersPage;
