import React, { useState, useEffect } from 'react';
import { Card, Typography, Table, Button, Modal, Form, Input, Dropdown, Select, InputNumber, message, Tag, Spin } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, DollarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MasterDataSubPageLayout from '../../../components/common/MasterDataSubPageLayout';
import { profileService } from '../../../api/services/profileService';
import { materialService } from '../../../api/services/materialService';
import { materialStockService } from '../../../api/services/materialStockService';
import { attributeService } from '../../../api/services/attributeService';
import { supplierService } from '../../../api/services/supplierService';
import { MaterialStock, CreateMaterialStockPayload, UpdateMaterialStockPayload } from '../../../types/materialStock';
import { Material } from '../../../types/material';
import { AttributeOption } from '../../../types/attribute';
import { Supplier } from '../../../types/supplier';

const { Text, Title } = Typography;
const { Option } = Select;

// Group options by their attribute (e.g., Color -> [Red, Blue])
interface AttributeWithOptions {
    attribute_id: string;
    attribute_name: string;
    options: AttributeOption[];
}

const MaterialStockPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [editingRecord, setEditingRecord] = useState<MaterialStock | null>(null);
    const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
    const [attributesWithOptions, setAttributesWithOptions] = useState<AttributeWithOptions[]>([]);
    const queryClient = useQueryClient();

    // Get business ID from user profile
    const { data: profileResponse } = useQuery({
        queryKey: ['profile'],
        queryFn: profileService.getProfile,
    });

    const businessId = profileResponse?.output?.business?.id?.toString();

    // Load all material stocks
    const { data: stocksResponse, isLoading: isStocksLoading } = useQuery({
        queryKey: ['materialStocks', businessId],
        queryFn: () => materialStockService.getAllMaterialStocks(businessId!),
        enabled: !!businessId,
    });

    const stocks = stocksResponse?.output?.values || [];

    // Load materials for the dropdown
    const { data: materialsResponse, isLoading: isMaterialsLoading } = useQuery({
        queryKey: ['materials', businessId],
        queryFn: () => materialService.getAllMaterials(businessId!),
        enabled: !!businessId,
    });

    const materials = materialsResponse?.output?.values || [];

    // Load suppliers for the dropdown
    const { data: suppliersResponse, isLoading: isSuppliersLoading } = useQuery({
        queryKey: ['suppliers', businessId],
        queryFn: () => supplierService.getAllSuppliers(businessId!, 1, 100), // Get up to 100 suppliers for now
        enabled: !!businessId,
    });

    const suppliers = suppliersResponse?.output?.values || [];

    // Find the material currently selected in the form
    // Fallback to editingRecord.material if not found in the paginated materials list
    const selectedMaterial = materials.find((m: Material) => m.mat_id === selectedMaterialId) ||
        (editingRecord?.material_id === selectedMaterialId ? editingRecord.material : null);

    // When a material is selected, fetch all its available attribute options
    useEffect(() => {
        const fetchOptionsGrouped = async () => {
            if (selectedMaterial && selectedMaterial.attributes && selectedMaterial.attributes.length > 0) {
                const grouped: AttributeWithOptions[] = [];
                for (const attr of selectedMaterial.attributes) {
                    try {
                        const response = await attributeService.getAllOptions(attr.attribute_id);
                        if (response.output && response.output.length > 0) {
                            grouped.push({
                                attribute_id: attr.attribute_id,
                                attribute_name: attr.name,
                                options: response.output
                            });
                        }
                    } catch (error) {
                        console.error('Error fetching options for attribute:', attr.attribute_id, error);
                    }
                }
                setAttributesWithOptions(grouped);
            } else {
                setAttributesWithOptions([]);
            }
        };
        fetchOptionsGrouped();
    }, [selectedMaterial]);

    // Save new stock item
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

    // Update existing stock item
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

    // Delete a stock item
    const deleteMutation = useMutation({
        mutationFn: (stockId: string) => materialStockService.deleteMaterialStock(stockId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['materialStocks', businessId] });
            message.success('Material stock deleted successfully');
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Failed to delete material stock');
        }
    });

    // Fill form when editing an item
    useEffect(() => {
        if (isModalOpen) {
            if (editingRecord) {
                setSelectedMaterialId(editingRecord.material_id);

                const formValues: Record<string, any> = {
                    material_id: editingRecord.material_id,
                    supplier_id: editingRecord.supplier_id,
                    quantity: parseFloat(editingRecord.quantity),
                    unit_cost: parseFloat(editingRecord.unit_cost || '0'),
                    reorder_level: parseFloat(editingRecord.reorder_level),
                    sku: editingRecord.sku,
                };

                // Set values for each attribute (Color, Size, etc.)
                editingRecord.attribute_options?.forEach(opt => {
                    formValues[`attr_${opt.attribute_id}`] = opt.option_id;
                });

                form.setFieldsValue(formValues);
            } else {
                form.resetFields();
                setSelectedMaterialId(null);
                setAttributesWithOptions([]);
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

    const handleDelete = (stockId: string) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this stock entry?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => deleteMutation.mutate(stockId),
        });
    };

    // Reset attribute selections if the material changes
    const handleMaterialChange = (value: string) => {
        setSelectedMaterialId(value);
        const fieldsToReset: Record<string, undefined> = {};
        attributesWithOptions.forEach(attr => {
            fieldsToReset[`attr_${attr.attribute_id}`] = undefined;
        });
        form.setFieldsValue(fieldsToReset);
    };

    const handleOk = () => {
        form.validateFields().then((values) => {
            // Collect all selected attribute options
            const selectedOptions: string[] = [];
            attributesWithOptions.forEach(attr => {
                const optionValue = values[`attr_${attr.attribute_id}`];
                if (optionValue) {
                    selectedOptions.push(optionValue);
                }
            });

            if (editingRecord) {
                // If we are editing and attributes haven't loaded yet (async fetch), 
                // do not send empty array which would clear existing attributes.
                // However, with the fallback in selectedMaterial, this is less likely.
                const finalOptions = attributesWithOptions.length > 0 ? selectedOptions : (editingRecord.attribute_options?.map(o => o.option_id) || []);

                updateMutation.mutate({
                    stock_id: editingRecord.stock_id,
                    supplier_id: values.supplier_id,
                    quantity: values.quantity,
                    unit_cost: values.unit_cost,
                    reorder_level: values.reorder_level,
                    sku: values.sku,
                    attribute_options: finalOptions
                });
            } else if (businessId) {
                createMutation.mutate({
                    business_id: businessId,
                    material_id: values.material_id,
                    supplier_id: values.supplier_id,
                    quantity: values.quantity,
                    unit_cost: values.unit_cost,
                    reorder_level: values.reorder_level,
                    sku: values.sku,
                    attribute_options: selectedOptions
                });
            }
        });
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setEditingRecord(null);
        setSelectedMaterialId(null);
        setAttributesWithOptions([]);
    };

    const columns: ColumnsType<MaterialStock> = [
        {
            title: 'Material',
            dataIndex: ['material', 'name'],
            key: 'material',
        },
        {
            title: 'SKU',
            dataIndex: 'sku',
            key: 'sku',
        },
        {
            title: 'Supplier',
            dataIndex: ['supplier', 'name'],
            key: 'supplier',
            render: (text) => text || <Text type="secondary">N/A</Text>
        },
        {
            title: 'Attributes',
            key: 'attributes',
            render: (_, record) => (
                <div className="flex flex-wrap gap-1">
                    {record.attribute_options?.map(opt => (
                        <Tag color="blue" key={opt.option_id}>
                            {opt.name} ({opt.code})
                        </Tag>
                    )) || '-'}
                </div>
            ),
            responsive: ['md']
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (value) => parseFloat(value).toFixed(2)
        },
        {
            title: 'Unit Cost',
            dataIndex: 'unit_cost',
            key: 'unit_cost',
            render: (value) => {
                const cost = parseFloat(value || '0');
                return <Text>{cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>;
            }
        },
        {
            title: 'Total Value',
            key: 'total_value',
            render: (_, record) => {
                const qty = parseFloat(record.quantity || '0');
                const cost = parseFloat(record.unit_cost || '0');
                const total = qty * cost;
                return <Text strong style={{ color: '#1677ff' }}>{total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>;
            }
        },
        {
            title: 'Re-order Level',
            dataIndex: 'reorder_level',
            key: 'reorder_level',
            render: (value) => parseFloat(value).toFixed(2)
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            align: 'center',
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
                            onClick: () => handleDelete(record.stock_id)
                        }
                    ]
                }} trigger={['click']}>
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    return (
        <MasterDataSubPageLayout title="Material Stock" onAdd={handleAdd} addButtonText="Add Stock">
            <div className="mb-6">
                <Text type="secondary">Manage inventory levels for material variants.</Text>
            </div>

            <Card bordered={false} className="rounded-lg">
                <div className="mb-4">
                    <Title level={4}>Stock Levels</Title>
                    <Text type="secondary">Current stock levels for materials.</Text>
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
                okText={editingRecord ? "Update" : "Create Stock Item"}
                confirmLoading={createMutation.isPending || updateMutation.isPending}
                cancelText="Cancel"
                width={500}
            >
                <Spin spinning={createMutation.isPending || updateMutation.isPending} tip={editingRecord ? "Updating..." : "Creating..."}>
                    <div className="mb-6">
                        <Text type="secondary">Define a new material variant and set its initial stock quantity.</Text>
                    </div>

                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="material_id"
                            label="Material"
                            rules={[{ required: true, message: 'Please select a material!' }]}
                        >
                            <Select
                                placeholder="Select a material"
                                onChange={handleMaterialChange}
                                loading={isMaterialsLoading}
                                disabled={!!editingRecord}
                            >
                                {materials.map((m: Material) => (
                                    <Option key={m.mat_id} value={m.mat_id}>{m.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="supplier_id"
                            label="Supplier"
                        >
                            <Select
                                placeholder="Select a supplier (Optional)"
                                loading={isSuppliersLoading}
                                allowClear
                                showSearch
                                optionFilterProp="children"
                            >
                                {suppliers.map((s: Supplier) => (
                                    <Option key={s.id} value={s.id}>{s.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* Dropdowns for each attribute (Color, Size, etc.) */}
                        {attributesWithOptions.map(attr => (
                            <Form.Item
                                key={attr.attribute_id}
                                name={`attr_${attr.attribute_id}`}
                                label={attr.attribute_name}
                                rules={[{ required: true, message: `Please select ${attr.attribute_name}!` }]}
                            >
                                <Select placeholder={`Select ${attr.attribute_name}`}>
                                    {attr.options.map(opt => (
                                        <Option key={opt.option_id} value={opt.option_id}>
                                            {opt.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        ))}

                        <Form.Item
                            name="sku"
                            label="SKU"
                            rules={[{ required: true, message: 'Please input SKU!' }]}
                        >
                            <Input placeholder="Enter SKU (e.g., MAT-STOCK-001)" />
                        </Form.Item>

                        <div className="grid grid-cols-3 gap-4">
                            <Form.Item
                                name="quantity"
                                label="Quantity"
                                rules={[{ required: true, message: 'Please input quantity!' }]}
                            >
                                <InputNumber className="w-full" min={0} step={0.01} placeholder="0" />
                            </Form.Item>

                            <Form.Item
                                name="unit_cost"
                                label="Unit Cost"
                                rules={[{ required: true, message: 'Please input cost!' }]}
                            >
                                <InputNumber className="w-full" min={0} step={0.01} placeholder="0.00" prefix={<DollarOutlined />} />
                            </Form.Item>

                            <Form.Item
                                name="reorder_level"
                                label="Re-order Level"
                                extra="Alert when stock is low."
                                rules={[{ required: true, message: 'Please input re-order level!' }]}
                            >
                                <InputNumber className="w-full" min={0} step={0.01} placeholder="0" />
                            </Form.Item>
                        </div>
                    </Form>
                </Spin>
            </Modal>
        </MasterDataSubPageLayout>
    );
};

export default MaterialStockPage;
