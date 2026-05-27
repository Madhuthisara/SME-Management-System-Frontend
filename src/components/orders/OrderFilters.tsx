import React from 'react';
import {
    Card,
    Row,
    Col,
    Input,
    Space,
    Select,
    Divider,
    DatePicker
} from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { OrderStatus, CustomOrderStatus } from '../../types/order';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface OrderFiltersProps {
    searchText: string;
    onSearchChange: (val: string) => void;
    statusFilter: string;
    onStatusChange: (val: string) => void;
    customStatuses: CustomOrderStatus[];
    dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null;
    onDateRangeChange: (dates: any) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
    searchText,
    onSearchChange,
    statusFilter,
    onStatusChange,
    customStatuses,
    dateRange,
    onDateRangeChange
}) => {
    return (
        <Card bordered={false} style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Row gutter={[16, 16]} align="middle">
                <Col xs={24} md={8}>
                    <Input
                        placeholder="Search customer, phone or ID..."
                        prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                        value={searchText}
                        onChange={(e) => onSearchChange(e.target.value)}
                        style={{ borderRadius: 8 }}
                    />
                </Col>
                <Col xs={24} md={8}>
                    <RangePicker
                        value={dateRange}
                        onChange={onDateRangeChange}
                        style={{ width: '100%', borderRadius: 8 }}
                        placeholder={['Start Date', 'End Date']}
                    />
                </Col>
                <Col xs={24} md={8}>
                    <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                        <FilterOutlined style={{ color: '#8c8c8c' }} />
                        <Select
                            value={statusFilter}
                            style={{ width: 150 }}
                            onChange={onStatusChange}
                            placeholder="Status"
                        >
                            <Option value="all">All Statuses</Option>
                            <Divider style={{ margin: '4px 0' }}>System Statuses</Divider>
                            <Option value={OrderStatus.NEW}>New</Option>
                            <Option value={OrderStatus.PROCESSING}>Processing</Option>
                            <Option value={OrderStatus.DELIVERED}>Delivered</Option>
                            <Option value={OrderStatus.REJECTED}>Rejected</Option>
                            <Option value={OrderStatus.RETURNED}>Returned</Option>
                            <Option value={OrderStatus.EXCHANGED}>Exchanged</Option>
                            {customStatuses.length > 0 && (
                                <>
                                    <Divider style={{ margin: '4px 0' }}>Custom Statuses</Divider>
                                    {customStatuses.map((status) => (
                                        <Option key={status.id} value={status.id}>
                                            <Space>
                                                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: status.color }} />
                                                {status.name}
                                            </Space>
                                        </Option>
                                    ))}
                                </>
                            )}
                        </Select>
                    </Space>
                </Col>
            </Row>
        </Card>
    );
};

export default OrderFilters;
