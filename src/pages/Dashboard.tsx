import React from 'react';
import {
    Typography,
    Card,
    Row,
    Col,
    Statistic,
    Table,
    Tag,
    Spin,
    Alert,
    Button
} from 'antd';
import {
    ShoppingCartOutlined,
    DollarCircleOutlined,
    InboxOutlined,
    AlertOutlined,
    ArrowUpOutlined,
    SyncOutlined
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { dashboardService } from '../api/services/dashboardService';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
    const { data: stats, isLoading, isError, refetch } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: dashboardService.getStats,
        refetchInterval: 60000, // Refetch every 1 minute
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" tip="Loading dashboard metrics..." />
            </div>
        );
    }

    if (isError || !stats) {
        return (
            <div className="p-4">
                <Alert
                    message="Connection Error"
                    description="We couldn't load the dashboard metrics. Please ensure the backend server is running."
                    type="error"
                    showIcon
                    action={
                        <Button size="small" type="primary" onClick={() => refetch()}>
                            Retry Now
                        </Button>
                    }
                />
            </div>
        );
    }

    const { summary, recent_orders, chart_data } = stats;

    const orderColumns = [
        {
            title: 'Customer',
            dataIndex: 'customer_name',
            key: 'customer_name',
            render: (text: string) => <Text strong className="text-xs sm:text-sm">{text}</Text>,
        },
        {
            title: 'Amount',
            dataIndex: 'total_amount',
            key: 'total_amount',
            render: (amount: number) => (
                <span className="text-xs sm:text-sm">
                    Rs. {Number(amount).toLocaleString()}
                </span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'blue';
                if (status === 'completed' || status === 'paid') color = 'green';
                if (status === 'cancelled' || status === 'failed') color = 'red';
                if (status === 'pending') color = 'orange';
                return (
                    <Tag color={color} className="uppercase font-semibold text-[10px] sm:text-xs">
                        {status}
                    </Tag>
                );
            },
        },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Header section with glassmorphism feel */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div>
                    <Title level={2} className="!mb-0 !font-bold text-gray-800">Operational Overview</Title>
                    <Text type="secondary" className="text-sm">Real-time business performance and inventory tracking</Text>
                </div>
                <Button
                    type="default"
                    icon={<SyncOutlined className={isLoading ? 'animate-spin' : ''} />}
                    onClick={() => refetch()}
                    className="hover:border-blue-500 hover:text-blue-500 transition-all font-medium"
                >
                    Update Data
                </Button>
            </div>

            {/* Summary Cards with gradient borders & shadows */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} className="shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl border-l-4 border-l-blue-500 overflow-hidden">
                        <Statistic
                            title={<span className="text-gray-500 font-semibold uppercase tracking-wider text-[10px]">Total Revenue</span>}
                            value={summary.total_revenue}
                            precision={2}
                            prefix={<DollarCircleOutlined className="mr-2 text-blue-500" />}
                            suffix={<span className="text-[10px] text-green-500 ml-1 font-normal"><ArrowUpOutlined /></span>}
                            valueStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} className="shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl border-l-4 border-l-purple-500 overflow-hidden">
                        <Statistic
                            title={<span className="text-gray-500 font-semibold uppercase tracking-wider text-[10px]">Processing Orders</span>}
                            value={summary.total_orders}
                            prefix={<ShoppingCartOutlined className="mr-2 text-purple-500" />}
                            valueStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} className="shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl border-l-4 border-l-emerald-500 overflow-hidden">
                        <Statistic
                            title={<span className="text-gray-500 font-semibold uppercase tracking-wider text-[10px]">Active Products</span>}
                            value={summary.total_products}
                            prefix={<InboxOutlined className="mr-2 text-emerald-500" />}
                            valueStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card bordered={false} className="shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl border-l-4 border-l-orange-500 overflow-hidden">
                        <Statistic
                            title={<span className="text-gray-500 font-semibold uppercase tracking-wider text-[10px]">Stock Alerts</span>}
                            value={summary.low_stock_materials}
                            prefix={<AlertOutlined className="mr-2 text-orange-500" />}
                            valueStyle={{
                                color: summary.low_stock_materials > 0 ? '#ea580c' : '#1e293b',
                                fontWeight: 'bold'
                            }}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                {/* Sales Chart - Taking more space on large screens */}
                <Col xs={24} xl={15}>
                    <Card
                        title={<span className="font-bold text-gray-700">Revenue Growth Trend</span>}
                        bordered={false}
                        className="shadow-sm rounded-xl h-full"
                    >
                        <div className="h-[320px] w-full pt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chart_data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                                        tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                                        tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        labelStyle={{ fontWeight: 'bold', color: '#1e293b', marginBottom: '4px' }}
                                        formatter={(val: any) => [`Rs. ${Number(val).toLocaleString()}`, 'Revenue']}
                                        labelFormatter={(label) => new Date(label).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#3b82f6"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                        animationBegin={200}
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Col>

                {/* Recent Activity Table */}
                <Col xs={24} xl={9}>
                    <Card
                        title={<span className="font-bold text-gray-700">Recent Transactions</span>}
                        bordered={false}
                        className="shadow-sm rounded-xl h-full overflow-hidden"
                    >
                        <Table
                            dataSource={recent_orders}
                            columns={orderColumns}
                            pagination={false}
                            rowKey="id"
                            size="small"
                            className="recent-orders-table"
                        />
                        <div className="mt-4 text-center">
                            <Button type="link" className="font-semibold text-blue-600">View Detailed Reports</Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
