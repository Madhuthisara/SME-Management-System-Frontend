import React, { useState, useMemo } from 'react';
import {
    Table,
    Tag,
    Space,
    Button,
    Typography,
    Tag as AntdTag,
    Modal,
    message,
    Tooltip,
} from 'antd';
import {
    EyeOutlined,
    CloseCircleOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../../api/services/orderService';
import { orderStatusService } from '../../api/services/orderStatusService';
import { Order, OrderStatus, OrderSource, PaymentMethod } from '../../types/order';
import { getLocalStorageData } from '../../utils/storage';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import AddOrderModal from '../../components/orders/AddOrderModal';
import OrderDetailsDrawer from '../../components/orders/OrderDetailsDrawer';
import OrderFilters from '../../components/orders/OrderFilters';
import { printOrder, downloadFile } from '../../utils/printService';
import InvoiceTemplate from '../../components/printing/InvoiceTemplate';
import { renderToStaticMarkup } from 'react-dom/server';

dayjs.extend(isBetween);

const { Title, Text } = Typography;

const OrderList: React.FC = () => {
    const queryClient = useQueryClient();
    const user = getLocalStorageData<any>('user') || {};
    const businessId = user.business_id;

    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchText, setSearchText] = useState('');
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // UI States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Data Fetching
    const { data: ordersData, isLoading } = useQuery({
        queryKey: ['orders', businessId, page, pageSize],
        queryFn: () => orderService.getAllOrders(businessId, page, pageSize),
        enabled: !!businessId,
    });

    const { data: singleOrderResponse, isLoading: isSingleOrderLoading } = useQuery({
        queryKey: ['order', selectedOrder?.id],
        queryFn: () => orderService.getOrderById(selectedOrder!.id),
        enabled: !!selectedOrder?.id && isDrawerOpen,
    });

    const { data: customStatusesData } = useQuery({
        queryKey: ['order-statuses', businessId],
        queryFn: () => orderStatusService.getAll(businessId),
        enabled: !!businessId,
    });

    const customStatuses = customStatusesData?.output?.values || [];
    const displayOrder = singleOrderResponse?.output || selectedOrder;

    // Mutations
    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status, customStatusId }: { id: string; status?: OrderStatus; customStatusId?: string | null }) =>
            orderService.updateOrderStatus(id, { status, custom_status_id: customStatusId }),
        onSuccess: () => {
            message.success('Order status updated');
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['order', selectedOrder?.id] });
        },
    });

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.NEW: return 'blue';
            case OrderStatus.PROCESSING: return 'orange';
            case OrderStatus.DELIVERED: return 'green';
            case OrderStatus.REJECTED: return 'red';
            case OrderStatus.RETURNED: return 'purple';
            case OrderStatus.EXCHANGED: return 'cyan';
            default: return 'default';
        }
    };

    // Table Columns
    const columns: ColumnsType<Order> = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <Text strong>#{text.substring(0, 8).toUpperCase()}</Text>,
        },
        {
            title: 'Customer',
            dataIndex: 'customer_name',
            key: 'customer_name',
            render: (name, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{name}</Text>
                    <Text type="secondary">{record.phone_number}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.district}, {record.nearest_main_city}</Text>
                </Space>
            ),
        },
        {
            title: 'Source',
            dataIndex: 'source',
            key: 'source',
            render: (source: OrderSource) => (
                <Tag color="geekblue">{source.toUpperCase()}</Tag>
            ),
        },
        {
            title: 'Payment',
            dataIndex: 'payment_method',
            key: 'payment_method',
            render: (method: PaymentMethod) => (
                <Text>{method?.toUpperCase() || 'N/A'}</Text>
            ),
        },
        {
            title: 'Total',
            dataIndex: 'total_amount',
            key: 'total_amount',
            render: (amount) => <Text strong>Rs. {parseFloat(amount).toLocaleString()}</Text>,
        },
        {
            title: 'Status',
            key: 'status',
            width: 150,
            render: (_, record: Order) => (
                <Space direction="vertical" size={2}>
                    <AntdTag color={getStatusColor(record.status)} style={{ fontSize: '10px' }}>
                        {record.status.toUpperCase()}
                    </AntdTag>
                    {record.custom_status && (
                        <AntdTag color={record.custom_status.color} style={{ fontSize: '10px' }}>
                            {record.custom_status.name.toUpperCase()}
                        </AntdTag>
                    )}
                </Space>
            ),
        },
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => dayjs(date).format('MMM DD, YYYY HH:mm'),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 80,
            align: 'center',
            render: (_, record: Order) => (
                <Space size="middle">
                    <Tooltip title="View Details">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRowClick(record);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Delete Order">
                        <Button
                            type="text"
                            danger
                            icon={<CloseCircleOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                Modal.confirm({
                                    title: 'Delete Order?',
                                    content: 'Are you sure you want to delete this order?',
                                    okType: 'danger',
                                    onOk: () => orderService.deleteOrder(record.id).then(() => {
                                        message.success('Order deleted');
                                        queryClient.invalidateQueries({ queryKey: ['orders'] });
                                    })
                                });
                            }}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const handleRowClick = (record: Order) => {
        setSelectedOrder(record);
        setIsDrawerOpen(true);
    };

    const filteredOrders = useMemo(() => {
        if (!ordersData?.output?.values) return [];

        return ordersData.output.values.filter(order => {
            const matchesStatus =
                statusFilter === 'all' ||
                order.status === statusFilter ||
                order.custom_status_id === statusFilter;

            const matchesSearch =
                order.customer_name.toLowerCase().includes(searchText.toLowerCase()) ||
                order.phone_number.includes(searchText) ||
                order.id.toLowerCase().includes(searchText.toLowerCase());

            let matchesDate = true;
            if (dateRange && dateRange[0] && dateRange[1]) {
                const orderDate = dayjs(order.created_at);
                matchesDate = orderDate.isBetween(dateRange[0], dateRange[1], 'day', '[]');
            }

            return matchesStatus && matchesSearch && matchesDate;
        });
    }, [ordersData, statusFilter, searchText, dateRange]);

    return (
        <div style={{ padding: '0px' }}>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={2} style={{ margin: 0 }}>Orders Management</Title>
                    <Text type="secondary">Manage and track your social media and manual orders.</Text>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                    style={{ backgroundColor: '#00b96b' }}
                >
                    Create Order
                </Button>
            </div>

            <OrderFilters
                searchText={searchText}
                onSearchChange={setSearchText}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                customStatuses={customStatuses}
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
            />

            <Table
                columns={columns}
                dataSource={filteredOrders}
                loading={isLoading}
                rowKey="id"
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: ordersData?.output?.total_records || 0,
                    onChange: (newPage, newPageSize) => {
                        setPage(newPage);
                        setPageSize(newPageSize);
                    }
                }}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                    style: { cursor: 'pointer' }
                })}
                style={{ backgroundColor: 'white', borderRadius: 12, overflow: 'hidden' }}
            />

            <OrderDetailsDrawer
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                order={displayOrder}
                isLoading={isSingleOrderLoading}
                customStatuses={customStatuses}
                getStatusColor={getStatusColor}
                onStatusUpdate={(id, val) => updateStatusMutation.mutate({ id, customStatusId: val })}
                onPrintReceipt={() => displayOrder && printOrder(displayOrder, 'receipt')}
                onPrintInvoice={() => displayOrder && printOrder(displayOrder, 'invoice')}
                onDownloadInvoice={() => {
                    if (displayOrder) {
                        const html = renderToStaticMarkup(<InvoiceTemplate order={displayOrder} />);
                        // Wrap in basic HTML structure for full compatibility
                        const fullHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Invoice</title><link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"></head><body>${html}</body></html>`;
                        downloadFile(fullHtml, `Invoice-${displayOrder.id.substring(0, 8)}.html`);
                    }
                }}
            />

            <AddOrderModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default OrderList;
