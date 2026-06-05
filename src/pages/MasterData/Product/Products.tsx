import React, { useState } from 'react';
import {
    Card, Typography, Button, Modal, Form, Input, Select, Row, Col,
    InputNumber, message, Badge, Empty, Dropdown, MenuProps, Upload, UploadFile, Pagination
} from 'antd';
import {
    PlusOutlined, MoreOutlined, EditOutlined, DeleteOutlined,
    ShoppingOutlined
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MasterDataSubPageLayout from '../../../components/common/MasterDataSubPageLayout';
import { profileService } from '../../../api/services/profileService';
import { productService } from '../../../api/services/productService';
import { categoryService } from '../../../api/services/categoryService';
import { productTemplateService } from '../../../api/services/productTemplateService';
import { Product } from '../../../types/product';
import { ensureArray } from '../../../utils/dataUtils';

const { Text, Title } = Typography;
const { Option } = Select;

interface GroupedCategory {
    id: string;
    name: string;
    items: Product[];
}

const ProductCard: React.FC<{
    product: Product;
    onEdit: (p: Product) => void;
    onDelete: (id: string) => void;
}> = ({ product, onEdit, onDelete }) => {
    const menuItems: MenuProps['items'] = [
        { key: 'edit', label: 'Edit', icon: <EditOutlined />, onClick: () => onEdit(product) },
        { key: 'delete', label: 'Delete', icon: <DeleteOutlined />, danger: true, onClick: () => onDelete(product.id) },
    ];

    const discountValue = parseFloat(product.discount);
    const basePriceValue = parseFloat(product.base_price);

    return (
        <Col xs={24} sm={12} md={8} lg={6}>
            <Card
                hoverable
                style={{ borderRadius: 12, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}
                cover={
                    <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                        <img
                            alt={product.name}
                            src={product.thumbnail_url || 'https://via.placeholder.com/300x180?text=No+Image'}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {discountValue > 0 && (
                            <Badge.Ribbon text={`${product.discount}% OFF`} color="red" />
                        )}
                    </div>
                }
                bodyStyle={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                        <Text type="secondary" style={{ fontSize: '11px', textTransform: 'uppercase', display: 'block' }}>
                            {product.category?.name || 'Uncategorized'}
                        </Text>
                        <Title level={5} style={{ margin: '4px 0', fontSize: '15px' }} ellipsis={{ rows: 2 }}>
                            {product.name}
                        </Title>
                    </div>
                    <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
                        <Button type="text" icon={<MoreOutlined />} style={{ padding: 0 }} />
                    </Dropdown>
                </div>

                <div style={{ margin: '8px 0' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>SKU: {product.sku}</Text>
                </div>

                {product.product_template && (
                    <div style={{ marginBottom: 12 }}>
                        <Badge
                            status="processing"
                            text={<Text style={{ fontSize: '11px' }}>BOM: {product.product_template.name}</Text>}
                        />
                    </div>
                )}

                <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                    <Title level={5} style={{ margin: 0, color: '#3f51b5' }}>
                        LKR {basePriceValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </Title>
                </div>
            </Card>
        </Col>
    );
};

const Products: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(15);

    // Get business ID
    const { data: profileResponse } = useQuery({
        queryKey: ['profile'],
        queryFn: profileService.getProfile,
    });
    const businessId = profileResponse?.output?.business?.id?.toString();

    // Queries
    const { data: productsResponse, isLoading: isProductsLoading } = useQuery({
        queryKey: ['products', businessId, page, pageSize],
        queryFn: () => productService.getAllProducts(businessId!, page, pageSize),
        enabled: !!businessId,
    });

    const { data: categoriesResponse } = useQuery({
        queryKey: ['categories', businessId],
        queryFn: () => categoryService.getAllCategories(businessId!),
        enabled: !!businessId,
    });

    const { data: templatesResponse } = useQuery({
        queryKey: ['product-templates', businessId],
        queryFn: () => productTemplateService.getAllTemplates(businessId!),
        enabled: !!businessId,
    });

    const products = ensureArray<Product>(productsResponse?.values);
    const totalProducts = (productsResponse as any)?.total_records || 0;
    const categories = ensureArray<any>(categoriesResponse?.values);
    const templates = ensureArray<any>(templatesResponse?.values);

    // Group products by category
    const productsByCategory: GroupedCategory[] = categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        items: products.filter((p: Product) => p.category_id === cat.id)
    })).filter((cat: GroupedCategory) => cat.items.length > 0);

    // Products with no category
    const uncategorizedProducts = products.filter((p: Product) => !p.category_id);

    // Mutations
    const createMutation = useMutation({
        mutationFn: (payload: any) => productService.createProduct(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products', businessId] });
            message.success('Product created successfully');
            handleCancel();
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Failed to create product');
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }: { id: string, payload: any }) => productService.updateProduct(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products', businessId] });
            message.success('Product updated successfully');
            handleCancel();
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Failed to update product');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => productService.deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products', businessId] });
            message.success('Product deleted');
        },
    });

    const handleAdd = () => {
        setEditingProduct(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);

        // Prepare initial file lists if images exist
        const thumbnailList: UploadFile[] = product.thumbnail_url ? [{
            uid: '-1',
            name: 'thumbnail.png',
            status: 'done',
            url: product.thumbnail_url,
        }] : [];

        const galleryList: UploadFile[] = product.images?.map((img, index) => ({
            uid: `-${index + 2}`,
            name: `image-${index}.png`,
            status: 'done',
            url: img.image_url,
        })) || [];

        form.setFieldsValue({
            ...product,
            base_price: parseFloat(product.base_price),
            discount: parseFloat(product.discount),
            thumbnail_url: thumbnailList,
            gallery: galleryList
        });
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        form.resetFields();
    };

    const handleImageUpload = async (options: any) => {
        const { file, onSuccess, onError } = options;
        try {
            const result = await productService.uploadImage(file as File);
            if (result.success) {
                onSuccess(result.url);
                message.success('Image uploaded successfully');
            } else {
                onError(new Error(result.message));
                message.error(result.message);
            }
        } catch (err: any) {
            onError(err);
            message.error('Failed to upload image');
        }
    };

    const handleOk = () => {
        form.validateFields().then((values) => {
            if (businessId) {
                // Extract URLs correctly: for newly uploaded files, AntD stores our URL string in `response`.
                // For existing files (in edit mode), the URL is in `url`.
                const extractUrl = (file: any) => {
                    if (!file) return null;
                    if (file.response) return file.response;
                    if (file.url && !file.url.startsWith('blob:')) return file.url;
                    return null;
                };

                const thumbnail_url = extractUrl(values.thumbnail_url?.[0]);
                const gallery = values.gallery?.map(extractUrl).filter(Boolean) || [];

                const payload = {
                    ...values,
                    business_id: businessId,
                    discount: values.discount || 0,
                    thumbnail_url: thumbnail_url,
                    gallery: gallery
                };

                if (editingProduct) {
                    updateMutation.mutate({ id: editingProduct.id, payload });
                } else {
                    createMutation.mutate(payload);
                }
            }
        });
    };

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: 'Delete Product?',
            content: 'This will permanently remove the product and its images.',
            okText: 'Yes, Delete',
            okType: 'danger',
            centered: true,
            onOk: () => deleteMutation.mutate(id),
        });
    };

    return (
        <MasterDataSubPageLayout
            title="Products"
            onAdd={handleAdd}
            addButtonText="Add Product"
        >
            <div style={{ marginBottom: 24 }}>
                <Text type="secondary">Manage final products for sale and their presentation in store.</Text>
            </div>

            {isProductsLoading ? (
                <Row gutter={[20, 20]}>
                    {[1, 2, 3, 4].map(k => (
                        <Col key={k} xs={24} sm={12} md={8} lg={6}>
                            <Card loading />
                        </Col>
                    ))}
                </Row>
            ) : products.length === 0 ? (
                <Empty description="No products found" style={{ marginTop: 60 }} />
            ) : (
                <>
                    {productsByCategory.map((cat: GroupedCategory) => (
                        <div key={cat.id} style={{ marginBottom: 40 }}>
                            <Title level={4} style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
                                <ShoppingOutlined style={{ color: '#3f51b5' }} /> {cat.name}
                                <Badge count={cat.items.length} style={{ backgroundColor: '#f5f5f5', color: '#999', boxShadow: 'none' }} />
                            </Title>
                            <Row gutter={[20, 20]}>
                                {cat.items.map((p: Product) => (
                                    <ProductCard
                                        key={p.id}
                                        product={p}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </Row>
                        </div>
                    ))}

                    {uncategorizedProducts.length > 0 && (
                        <div style={{ marginBottom: 40 }}>
                            <Title level={4} style={{ marginBottom: 20, borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>Uncategorized</Title>
                            <Row gutter={[20, 20]}>
                                {uncategorizedProducts.map((p: Product) => (
                                    <ProductCard
                                        key={p.id}
                                        product={p}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </Row>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
                        <Pagination
                            current={page}
                            pageSize={pageSize}
                            total={totalProducts}
                            onChange={(newPage, newSize) => { setPage(newPage); setPageSize(newSize); }}
                            showSizeChanger
                        />
                    </div>
                </>
            )}

            <Modal
                title={editingProduct ? "Edit Product" : "Add Product"}
                open={isModalOpen}
                onCancel={handleCancel}
                onOk={handleOk}
                width={700}
                centered
                okText={editingProduct ? "Update Product" : "Create Product"}
                okButtonProps={{
                    style: { backgroundColor: '#3f51b5', borderRadius: 6 },
                    loading: createMutation.isPending || updateMutation.isPending
                }}
                cancelButtonProps={{ style: { borderRadius: 6 } }}
                bodyStyle={{ maxHeight: '75vh', overflowY: 'auto' }}
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item
                        name="name"
                        label={<Text strong>Product Name</Text>}
                        rules={[{ required: true, message: 'Please enter product name' }]}
                    >
                        <Input placeholder="e.g., 'Classic White T-Shirt'" size="large" style={{ borderRadius: 6 }} />
                    </Form.Item>

                    <Form.Item name="description" label={<Text strong>Description</Text>}>
                        <Input.TextArea rows={3} placeholder="Detailed description..." style={{ borderRadius: 6 }} />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="sku" label={<Text strong>SKU</Text>} rules={[{ required: true, message: 'Please enter SKU' }]}>
                                <Input placeholder="e.g., TSHIRT-WHT-MD" size="large" style={{ borderRadius: 6 }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="category_id" label={<Text strong>Product Chain (Category)</Text>} rules={[{ required: true, message: 'Please select a chain' }]}>
                                <Select placeholder="Select a chain" size="large" style={{ borderRadius: 6 }}>
                                    {categories.map((c: any) => <Option key={c.id} value={c.id}>{c.name}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="product_template_id" label={<Text strong>Product Template (BOM)</Text>}>
                                <Select placeholder="Select a template (Optional)" size="large" style={{ borderRadius: 6 }} allowClear>
                                    {templates.map((t: any) => <Option key={t.id} value={t.id}>{t.name}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="base_price" label={<Text strong>Base Price</Text>} rules={[{ required: true, message: 'Please enter price' }]}>
                                <InputNumber<number>
                                    style={{ width: '100%', borderRadius: 6 }}
                                    min={0}
                                    prefix="LKR"
                                    size="large"
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={displayValue => {
                                        const cleanedValue = displayValue?.replace(/LKR\s?|(,*)/g, '') || '';
                                        const parsed = parseFloat(cleanedValue);
                                        return isNaN(parsed) ? 0 : parsed;
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="discount" label={<Text strong>Discount (%)</Text>}>
                        <InputNumber
                            style={{ width: '100%', borderRadius: 6 }}
                            min={0}
                            max={100}
                            placeholder="e.g., 15"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="thumbnail_url"
                        label={<Text strong>Thumbnail Image</Text>}
                        valuePropName="fileList"
                        getValueFromEvent={(e: any) => Array.isArray(e) ? e : e?.fileList}
                    >
                        <Upload
                            listType="picture-card"
                            maxCount={1}
                            customRequest={handleImageUpload}
                            accept="image/*"
                        >
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="gallery"
                        label={<Text strong>Gallery Images</Text>}
                        valuePropName="fileList"
                        getValueFromEvent={(e: any) => Array.isArray(e) ? e : e?.fileList}
                    >
                        <Upload
                            listType="picture-card"
                            multiple
                            customRequest={handleImageUpload}
                            accept="image/*"
                        >
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </MasterDataSubPageLayout>
    );
};

export default Products;
