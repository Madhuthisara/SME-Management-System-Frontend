import React, { useState, useMemo } from 'react';
import {
    Typography,
    Card,
    Table,
    DatePicker,
    Space,
    Tag,
    Row,
    Col,
    Button,
    Input,
    Alert
} from 'antd';
import {
    PrinterOutlined,
    SearchOutlined,
    DownloadOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { orderService } from '../api/services/orderService';
import { Order, OrderStatus } from '../types/order';
import { getLocalStorageData } from '../utils/storage';

dayjs.extend(isBetween);

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const Reports: React.FC = () => {
    const user = getLocalStorageData<any>('user') || {};
    const businessId = user.business_id;

    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
        dayjs().startOf('month'),
        dayjs().endOf('month')
    ]);
    const [searchText, setSearchText] = useState('');

    const { data: ordersData, isLoading, isError, refetch } = useQuery({
        queryKey: ['orders', businessId],
        queryFn: () => orderService.getAllOrders(businessId, 1, 1000),
        enabled: !!businessId,
    });

    const filteredData = useMemo(() => {
        const rawOrders = ordersData?.output?.values ?? (Array.isArray(ordersData?.output) ? ordersData.output : []);
        if (!rawOrders.length) return [];

        return rawOrders.filter((order: Order) => {
            const orderDate = dayjs(order.created_at);
            const isInRange = orderDate.isBetween(dateRange[0], dateRange[1], 'day', '[]');

            const matchesSearch =
                order.customer_name.toLowerCase().includes(searchText.toLowerCase()) ||
                order.id.toLowerCase().includes(searchText.toLowerCase()) ||
                order.phone_number.includes(searchText);

            return isInRange && matchesSearch;
        });
    }, [ordersData, dateRange, searchText]);

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

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
            render: (text: string) => <Text strong>#{text.substring(0, 8).toUpperCase()}</Text>,
        },
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
            sorter: (a: Order, b: Order) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
        },
        {
            title: 'Customer',
            dataIndex: 'customer_name',
            key: 'customer_name',
            render: (name: string, record: Order) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{name}</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.phone_number}</Text>
                </Space>
            ),
        },
        {
            title: 'Delivery Address',
            key: 'address',
            render: (_: any, record: Order) => (
                <div style={{ maxWidth: '250px' }}>
                    <Text style={{ display: 'block' }}>{record.delivery_address}</Text>
                    <Text type="secondary" style={{ fontSize: '11px' }}>{record.nearest_main_city}, {record.district}</Text>
                </div>
            ),
        },
        {
            title: 'Amount',
            dataIndex: 'total_amount',
            key: 'total_amount',
            render: (amount: string) => <Text strong>Rs. {parseFloat(amount).toLocaleString()}</Text>,
            sorter: (a: Order, b: Order) => parseFloat(a.total_amount) - parseFloat(b.total_amount),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: OrderStatus) => (
                <Tag color={getStatusColor(status)} style={{ borderRadius: '4px', fontWeight: 'bold' }}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
    ];

    const totalCOD = filteredData.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);

    const handlePrint = () => {
        window.print();
    };

    if (isError) {
        return (
            <div style={{ padding: '24px' }}>
                <Alert
                    message="Error loading reports"
                    description="Failed to fetch order data. Please try again later."
                    type="error"
                    action={<Button size="small" type="primary" onClick={() => refetch()}>Retry</Button>}
                />
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <div className="report-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={2} style={{ margin: 0, fontWeight: '800', color: '#1e293b' }}>Delivery Register</Title>
                    <Text type="secondary">Financial and delivery performance tracking</Text>
                </div>
                <Space>
                    <Button icon={<PrinterOutlined />} onClick={handlePrint}>Print Report</Button>
                    <Button type="primary" icon={<DownloadOutlined />} style={{ backgroundColor: '#0ea5e9' }}>Export Excel</Button>
                </Space>
            </div>

            <Card bordered={false} style={{ marginBottom: '24px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} className="filter-card">
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} lg={12}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Text strong>Filter Range:</Text>
                            <RangePicker
                                value={dateRange}
                                onChange={(dates) => dates && setDateRange([dates[0] as dayjs.Dayjs, dates[1] as dayjs.Dayjs])}
                                style={{ borderRadius: '8px', width: '100%' }}
                            />
                        </div>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Input
                            placeholder="Search by customer, phone or order ID..."
                            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ borderRadius: '8px' }}
                        />
                    </Col>
                </Row>
            </Card>

            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }} className="stats-row">
                <Col xs={24} md={8}>
                    <Card bordered={false} style={{ borderRadius: '12px', textAlign: 'center', backgroundColor: '#eff6ff' }}>
                        <Text type="secondary" strong style={{ fontSize: '12px', textTransform: 'uppercase' }}>Total Deliveries</Text>
                        <Title level={3} style={{ margin: '8px 0 0 0' }}>{filteredData.length}</Title>
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card bordered={false} style={{ borderRadius: '12px', textAlign: 'center', backgroundColor: '#ecfdf5' }}>
                        <Text type="secondary" strong style={{ fontSize: '12px', textTransform: 'uppercase' }}>Total COD Amount</Text>
                        <Title level={3} style={{ margin: '8px 0 0 0', color: '#059669' }}>Rs. {totalCOD.toLocaleString()}</Title>
                    </Card>
                </Col>
                <Col xs={24} md={8}>
                    <Card bordered={false} style={{ borderRadius: '12px', textAlign: 'center', backgroundColor: '#fef2f2' }}>
                        <Text type="secondary" strong style={{ fontSize: '12px', textTransform: 'uppercase' }}>Avg. Order Value</Text>
                        <Title level={3} style={{ margin: '8px 0 0 0' }}>
                            Rs. {filteredData.length > 0 ? (totalCOD / filteredData.length).toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0}
                        </Title>
                    </Card>
                </Col>
            </Row>

            <Card bordered={false} bodyStyle={{ padding: 0 }} style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    loading={isLoading}
                    rowKey="id"
                    pagination={{ pageSize: 12 }}
                    style={{ backgroundColor: 'white' }}
                />
            </Card>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .report-header .ant-btn, .filter-card, .ant-table-pagination {
                        display: none !important;
                    }
                    .ant-card {
                        box-shadow: none !important;
                        border: 1px solid #e2e8f0 !important;
                    }
                    body {
                        background-color: white !important;
                        padding: 0 !important;
                    }
                    .stats-row {
                        margin-bottom: 40px !important;
                    }
                }
            `}} />
        </div>
    );
};

export default Reports;
