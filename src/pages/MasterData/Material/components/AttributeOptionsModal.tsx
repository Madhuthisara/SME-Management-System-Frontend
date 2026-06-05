import React, { useState } from 'react';
import { Modal, Table, Button, Form, Input, message, Typography, Dropdown } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attributeService } from '../../../../api/services/attributeService';
import { Attribute, AttributeOption, CreateAttributeOptionPayload, UpdateAttributeOptionPayload } from '../../../../types/attribute';
import type { ColumnsType } from 'antd/es/table';
import { extractPaginatedData } from '../../../../utils/dataUtils';

const { Text } = Typography;

interface AttributeOptionsModalProps {
    attribute: Attribute | null;
    open: boolean;
    onClose: () => void;
}

const AttributeOptionsModal: React.FC<AttributeOptionsModalProps> = ({ attribute, open, onClose }) => {
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingOption, setEditingOption] = useState<AttributeOption | null>(null);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    const attributeId = attribute?.attribute_id;

    // Fetch Options
    const { data: optionsResponse, isLoading } = useQuery({
        queryKey: ['attribute-options', attributeId],
        queryFn: () => attributeService.getAllOptions(attributeId!),
        enabled: !!attributeId && open,
    });

    const options = extractPaginatedData<AttributeOption>(optionsResponse);

    // Create Mutation
    const createMutation = useMutation({
        mutationFn: (payload: CreateAttributeOptionPayload) => attributeService.createOption(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attribute-options', attributeId] });
            message.success('Option created successfully');
            handleFormCancel();
        },
    });

    // Update Mutation
    const updateMutation = useMutation({
        mutationFn: (payload: UpdateAttributeOptionPayload) => attributeService.updateOption(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attribute-options', attributeId] });
            message.success('Option updated successfully');
            handleFormCancel();
        },
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: (id: string) => attributeService.deleteOption(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['attribute-options', attributeId] });
            message.success('Option deleted successfully');
        },
    });

    const handleAdd = () => {
        setEditingOption(null);
        form.resetFields();
        setIsFormModalOpen(true);
    };

    const handleEdit = (record: AttributeOption) => {
        setEditingOption(record);
        form.setFieldsValue({
            name: record.name,
            code: record.code,
            description: record.description
        });
        setIsFormModalOpen(true);
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this option?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            onOk: () => deleteMutation.mutate(id),
        });
    };

    const handleFormOk = () => {
        form.validateFields().then((values) => {
            if (editingOption) {
                updateMutation.mutate({
                    option_id: editingOption.option_id,
                    name: values.name,
                    code: values.code,
                    description: values.description,
                });
            } else if (attributeId) {
                createMutation.mutate({
                    attribute_id: attributeId,
                    name: values.name,
                    code: values.code,
                    description: values.description,
                });
            }
        });
    };

    const handleFormCancel = () => {
        setIsFormModalOpen(false);
        form.resetFields();
        setEditingOption(null);
    };

    const columns: ColumnsType<AttributeOption> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 80,
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
                        onClick: () => handleDelete(record.option_id),
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
        <Modal
            title={`Manage Options for ${attribute?.name}`}
            open={open}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary">Add or edit values for this attribute.</Text>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Option
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={options}
                rowKey="option_id"
                loading={isLoading}
                pagination={{ pageSize: 5 }}
            />

            <Modal
                title={editingOption ? "Edit Option" : "Add Option"}
                open={isFormModalOpen}
                onOk={handleFormOk}
                onCancel={handleFormCancel}
                okText={editingOption ? "Update" : "Create"}
                confirmLoading={createMutation.isPending || updateMutation.isPending}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Option Name"
                        rules={[{ required: true, message: 'Please input the option name!' }]}
                    >
                        <Input placeholder="e.g. Red, Extra Large" />
                    </Form.Item>
                    <Form.Item
                        name="code"
                        label="Option Code"
                        rules={[{ required: true, message: 'Please input the option code!' }]}
                    >
                        <Input placeholder="e.g. RED, XL" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                    >
                        <Input.TextArea placeholder="Enter description" rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </Modal>
    );
};

export default AttributeOptionsModal;
