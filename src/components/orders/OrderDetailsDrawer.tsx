import React from 'react';
import {
    Drawer,
    Typography,
    Descriptions,
    Divider,
    List,
    Avatar,
    Space,
    Tag,
    Select,
    Button,
    Spin
} from 'antd';
import {
    PrinterOutlined,
    FileTextOutlined,
    DownloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Order, OrderStatus, CustomOrderStatus } from '../../types/order';

const { Title, Text } = Typography;
const { Option } = Select;

interface OrderDetailsDrawerProps {
    open: boolean;
    onClose: () => void;
    order: Order | null;
    isLoading: boolean;
    customStatuses: CustomOrderStatus[];
    onStatusUpdate: (id: string, customStatusId: string | null) => void;
    onPrintReceipt: () => void;
    onPrintInvoice: () => void;
    onDownloadInvoice: () => void;
    getStatusColor: (status: OrderStatus) => string;
}

const OrderDetailsDrawer: React.FC<OrderDetailsDrawerProps> = ({
    open,
    onClose,
    order,
    isLoading,
    customStatuses,
    onStatusUpdate,
    onPrintReceipt,
    onPrintInvoice,
    onDownloadInvoice,
    getStatusColor
}) => {
    return (
        <Drawer
            title={<Title level={4} style={{ margin: 0 }}>Order Details - #{order?.id.substring(0, 8)}</Title>}
            placement="right"
            onClose={onClose}
            open={open}
            width={600}
            bodyStyle={{ paddingBottom: 80 }}
            footer={
                order && (
                    <div style={{ textAlign: 'right' }}>
                        <Button
                            icon={<PrinterOutlined />}
                            onClick={onPrintReceipt}
                            style={{ marginRight: 8 }}
                        >
                            Print Receipt
                        </Button>
                        <Button
                            icon={<FileTextOutlined />}
                            onClick={onPrintInvoice}
                            type="primary"
                            style={{ marginRight: 8 }}
                        >
                            Print Invoice
                        </Button>
                        <Button
                            icon={<DownloadOutlined />}
                            onClick={onDownloadInvoice}
                            style={{ marginRight: 8 }}
                        >
                            Download
                        </Button>
                        <Button onClick={onClose}>Close</Button>
                    </div>
                )
            }
        >
            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 16 }}><Text type="secondary">Loading order details...</Text></div>
                </div>
            ) : order && (
                <>
                    <Descriptions title="Customer Information" bordered column={1} size="small">
                        <Descriptions.Item label="Name"><Text strong>{order.customer_name}</Text></Descriptions.Item>
                        <Descriptions.Item label="Primary Phone">{order.phone_number}</Descriptions.Item>
                        {order.secondary_phone_number && (
                            <Descriptions.Item label="Secondary Phone">{order.secondary_phone_number}</Descriptions.Item>
                        )}
                        <Descriptions.Item label="Address">{order.delivery_address}</Descriptions.Item>
                        <Descriptions.Item label="District">{order.district}</Descriptions.Item>
                        <Descriptions.Item label="City">{order.nearest_main_city}</Descriptions.Item>
                    </Descriptions>

                    <Divider titlePlacement="left">Order Items</Divider>
                    <List
                        itemLayout="horizontal"
                        dataSource={order.items}
                        renderItem={(item: any) => (
                            <List.Item
                                extra={
                                    <div style={{ textAlign: 'right' }}>
                                        <Text strong>Rs. {parseFloat(item.total_price).toLocaleString()}</Text>
                                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                                            {item.quantity} x Rs. {parseFloat(item.unit_price).toLocaleString()}
                                        </div>
                                    </div>
                                }
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Avatar
                                            shape="square"
                                            size={48}
                                            src={item.product?.thumbnail_url || 'https://via.placeholder.com/48'}
                                        />
                                    }
                                    title={<Text strong>{item.product?.name || 'Unknown Product'}</Text>}
                                    description={
                                        <Space size={[0, 4]} wrap>
                                            {item.selected_attributes?.map((attr: any) => (
                                                <Tag color="blue" key={attr.option_id} style={{ fontSize: '11px' }}>
                                                    <Text strong style={{ fontSize: '10px' }}>{attr.attribute_name?.toUpperCase()}: </Text>
                                                    {attr.option_name}
                                                </Tag>
                                            )) || <Text type="secondary" style={{ fontSize: '12px' }}>No variations</Text>}
                                        </Space>
                                    }
                                />
                            </List.Item>
                        )}
                    />

                    <Divider />
                    <Descriptions title="Order Summary" bordered column={1} size="small">
                        <Descriptions.Item label="Status">
                            <Space wrap>
                                <Tag color={getStatusColor(order.status)}>
                                    {order.status.toUpperCase()}
                                </Tag>
                                {order.custom_status && (
                                    <Tag color={order.custom_status.color}>
                                        {order.custom_status.name}
                                    </Tag>
                                )}
                            </Space>
                        </Descriptions.Item>
                        <Descriptions.Item label="Update Status">
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Set custom status"
                                value={order.custom_status_id || null}
                                onChange={(val) => onStatusUpdate(order.id, val)}
                                allowClear
                            >
                                {customStatuses.map((status) => (
                                    <Option key={status.id} value={status.id}>
                                        <Space>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: status.color }} />
                                            {status.name}
                                        </Space>
                                    </Option>
                                ))}
                            </Select>
                        </Descriptions.Item>
                        <Descriptions.Item label="Payment Method">{order.payment_method?.toUpperCase() || 'N/A'}</Descriptions.Item>
                        <Descriptions.Item label="Source">
                            <Tag color="geekblue">{order.source.toUpperCase()}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Date">{dayjs(order.created_at).format('MMM DD, YYYY HH:mm')}</Descriptions.Item>
                        {order.notes && (
                            <Descriptions.Item label="Notes">{order.notes}</Descriptions.Item>
                        )}
                        <Descriptions.Item label="Total Amount">
                            <Text type="danger" strong style={{ fontSize: '18px' }}>
                                Rs. {parseFloat(order.total_amount).toLocaleString()}
                            </Text>
                        </Descriptions.Item>
                    </Descriptions>
                </>
            )}
        </Drawer>
    );
};

export default OrderDetailsDrawer;
