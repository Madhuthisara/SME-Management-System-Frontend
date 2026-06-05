import React, { useState } from 'react';
import { Card, Typography, Table, Button, Modal, Form, Input, InputNumber, Dropdown, message, Select, Tag } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MasterDataSubPageLayout from '../../../components/common/MasterDataSubPageLayout';
import { materialStockService } from '../../../api/services/materialStockService';
import { materialService } from '../../../api/services/materialService';
import { supplierService } from '../../../api/services/supplierService';
import { profileService } from '../../../api/services/profileService';
import { ensureArray } from '../../../utils/dataUtils';
import { MaterialStock, CreateMaterialStockPayload, UpdateMaterialStockPayload } from '../../../types/materialStock';

const { Text, Title } = Typography;
const { Option } = Select;

const MaterialStockPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const [editingRecord, setEditingRecord] = useState<MaterialStock | null>(null);

    const { data: profileResponse } = useQuery({
        queryKey: ['profile'],
        queryFn: profileService.getProfile,
    });

    const businessId = profileResponse?.output?.business?.id?.toString();

    // Fetch Material Stocks
    const { data: stocksResponse, isLoading: isStocksLoading } = useQuery({
        queryKey: ['materialStocks', businessId],
        queryFn: () => materialStockService.getAllMaterialStocks(businessId!),
        enabled: !!businessId,
    });
    const stocks = ensureArray<MaterialStock>(stocksResponse?.values || (stocksResponse as any)?.data);

    // Fetch Materials
    const { data: materialsResponse, isLoading: isMaterialsLoading } = useQuery({
        queryKey: ['materials', businessId],
        queryFn: () => materialService.getAllMaterials(businessId!),
        enabled: !!businessId,
    });
    const materials = ensureArray<any>(materialsResponse?.values || (materialsResponse as any)?.data);

    // Fetch Suppliers
    const { data: suppliersResponse, isLoading: isSuppliersLoading } = useQuery({
        queryKey: ['suppliers', businessId],
        queryFn: () => supplierService.getAllSuppliers(businessId!),
        enabled: !!businessId,
    });
    const suppliers = ensureArray<any>((suppliersResponse as any)?.values || (suppliersResponse as any)?.data || (suppliersResponse as any)?.output?.data);

    const createMutation = useMutation({
        mutationFn: (payload: CreateMaterialStockPayload) => materialStockService.createMaterialStock(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['materialStocks', businessId] });
            message.success('Material stock created successfully');
            handleCancel();
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Failed to create material stock');
        }
    });

    const updateMutation = useMutation({
        mutationFn: (payload: UpdateMaterialStockPayload) => materialStockService.updateMaterialStock(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['materialStocks', businessId] });
            message.success('Material stock updated successfully');
            handleCancel();
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Failed to update material stock');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => materialStockService.deleteMaterialStock(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['materialStocks', businessId] });
            message.success('Material stock deleted successfully');
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Failed to delete material stock');
        }
    });

    React.useEffect(() => {
        if (isModalOpen) {
            if (editingRecord) {
                form.setFieldsValue({
                    material_id: editingRecord.material_id,
                    supplier_id: editingRecord.supplier_id,
                    quantity: Number(editingRecord.quantity),
                    unit_cost: editingRecord.unit_cost ? Number(editingRecord.unit_cost) : undefined,
                    reorder_level: Number(editingRecord.reorder_level),
                    sku: editingRecord.sku,
                    attribute_options: editingRecord.attribute_options?.map(a => a.pivot.option_id) || []
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

    const handleEdit = (record: MaterialStock) => {
        setEditingRecord(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this stock?',
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
                    stock_id: editingRecord.stock_id,
                    supplier_id: values.supplier_id,
                    quantity: values.quantity,
                    unit_cost: values.unit_cost,
                    reorder_level: values.reorder_level,
                    sku: values.sku,
                    attribute_options: values.attribute_options || []
                });
            } else if (businessId) {
                // මෙතනදී ඔබ ඉල්ලූ පරිදි payload එක createMutation වෙත පාස් වේ
                createMutation.mutate({
                    business_id: businessId,
                    material_id: values.material_id,
                    supplier_id: values.supplier_id,
                    quantity: values.quantity,
                    unit_cost: values.unit_cost,
                    reorder_level: values.reorder_level,
                    sku: values.sku,
                    attribute_options: values.attribute_options || []
                });
            }
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setEditingRecord(null);
    };

    const columns: ColumnsType<MaterialStock> = [
        { title: 'SKU', dataIndex: 'sku', key: 'sku' },
        { title: 'Material Name', dataIndex: ['material', 'name'], key: 'material_name' },
        { title: 'Supplier', dataIndex: ['supplier', 'name'], key: 'supplier_name', render: (text) => text || 'N/A' },
        { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Unit Cost', dataIndex: 'unit_cost', key: 'unit_cost', render: (val) => val ? val : 'N/A' },
        {
            title: 'Reorder Level',
            dataIndex: 'reorder_level',
            key: 'reorder_level',
            render: (val, record) => {
                const isLow = Number(record.quantity) <= Number(val);
                return <Tag color={isLow ? "red" : "green"}>{val}</Tag>;
            }
        },
        {
            title: 'Actions', key: 'actions', width: 100, align: 'center',
            render: (_, record) => (
                <Dropdown menu={{
                    items: [
                        { key: 'edit', label: 'Edit', icon: <EditOutlined />, onClick: () => handleEdit(record) },
                        { key: 'delete', label: 'Delete', icon: <DeleteOutlined />, danger: true, onClick: () => handleDelete(record.stock_id) }
                    ]
                }} trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    return (
        <MasterDataSubPageLayout title="Material Stocks" onAdd={handleAdd} addButtonText="Add Stock">
            <div className="mb-6">
                <Text type="secondary">Manage your material inventory, suppliers, and reorder levels.</Text>
            </div>

            <Card bordered={false} className="rounded-lg">
                <div className="mb-4">
                    <Title level={4}>Material Stock</Title>
                    <Text type="secondary">A comprehensive list of all material stocks.</Text>
                </div>

                <Table
                    columns={columns}
                    dataSource={stocks}
                    rowKey="stock_id"
                    loading={isStocksLoading}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Modal
                title={editingRecord ? "Edit Material Stock Item" : "Add Material Stock Item"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null} // Default Antd buttons ඉවත් කර custom buttons දැමීමට
                width={550}
            >
                <div className="mb-4">
                    <Text type="secondary">Define a new material variant and set its initial stock quantity.</Text>
                </div>

                <Form form={form} layout="vertical" onFinish={handleOk}>
                    {/* Material Dropdown */}
                    <Form.Item name="material_id" label="Material" rules={[{ required: true, message: 'Please select a material!' }]}>
                        <Select placeholder="Select a material" loading={isMaterialsLoading} disabled={!!editingRecord}>
                            {materials.map((m: any) => (
                                <Option key={m.mat_id || m.id} value={m.mat_id || m.id}>{m.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Supplier Dropdown */}
                    <Form.Item name="supplier_id" label="Supplier">
                        <Select placeholder="Select a supplier (Optional)" loading={isSuppliersLoading} allowClear>
                            {suppliers.map((s: any) => (
                                <Option key={s.supplier_id || s.id} value={s.supplier_id || s.id}>{s.name || s.company_name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* SKU Input */}
                    <Form.Item name="sku" label="SKU" rules={[{ required: true, message: 'Please input the SKU!' }]}>
                        <Input placeholder="Enter SKU (e.g., MAT-STOCK-001)" />
                    </Form.Item>

                    {/* Quantity, Unit Cost, Reorder Level - Grid Layout */}
                    <div className="grid grid-cols-3 gap-4">
                        <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: 'Please input quantity!' }]}>
                            <InputNumber className="w-full" min={0} placeholder="0" />
                        </Form.Item>

                        <Form.Item name="unit_cost" label="Unit Cost">
                            <InputNumber
                                className="w-full"
                                min={0}
                                step={0.01}
                                placeholder="0.00"
                                prefix={<span className="text-gray-400">$</span>}
                            />
                        </Form.Item>

                        <Form.Item
                            name="reorder_level"
                            label="Reorder Level"
                            rules={[{ required: true, message: 'Please input reorder level!' }]}
                            extra={<span className="text-xs text-gray-400 block mt-1">Alert when stock is low.</span>}
                        >
                            <InputNumber className="w-full" min={0} placeholder="0" />
                        </Form.Item>
                    </div>

                    {/* Form Buttons */}
                    <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-100">
                        <Button onClick={handleCancel} className="rounded-md px-6">
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={createMutation.isPending || updateMutation.isPending}
                            className="bg-[#00b96b] hover:bg-[#009656] border-none rounded-md px-6 text-white"
                        >
                            {editingRecord ? "Update Stock Item" : "Create Stock Item"}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </MasterDataSubPageLayout>
    );
};

export default MaterialStockPage;