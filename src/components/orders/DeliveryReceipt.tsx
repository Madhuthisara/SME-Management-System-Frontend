import React from 'react';
import { Typography, Row, Col } from 'antd';
import { Order } from '../../types/order';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

interface DeliveryReceiptProps {
    order: Order;
    businessName?: string;
    businessPhone?: string;
}

const DeliveryReceipt: React.FC<DeliveryReceiptProps> = ({
    order,
    businessName = "Raging Fire Apparel",
    businessPhone = "0701951000"
}) => {
    return (
        <div id="printable-receipt" style={{
            width: '210mm',
            height: '148mm', // A5 landscape
            padding: '20px',
            backgroundColor: '#white',
            color: 'black',
            fontFamily: 'monospace',
            border: '2px solid black',
            fontSize: '14px',
            lineHeight: '1.4',
            position: 'relative'
        }}>
            {/* Header / Logo Section */}
            <div style={{ borderBottom: '2px solid black', paddingBottom: '10px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ textAlign: 'left' }}>
                    <Title level={3} style={{ margin: 0, fontWeight: '900', letterSpacing: '2px' }}>KOOMBIYO</Title>
                    <Text style={{ fontSize: '12px', display: 'block', fontWeight: 'bold' }}>D E L I V E R Y</Text>
                    <Text style={{ fontSize: '10px' }}>Your Delivery Partner</Text>
                </div>
                <div style={{ textAlign: 'right', fontSize: '10px' }}>
                    <Text style={{ display: 'block' }}>Address: No. 25, Epitamulla Road, Pita Kotte</Text>
                    <Text style={{ display: 'block' }}>Tel: +94 117 886 786 | Web: koombiyodelivery.lk</Text>
                </div>
            </div>

            <Row gutter={20} style={{ marginBottom: '10px' }}>
                <Col span={12}>
                    <div style={{ border: '1px solid black', padding: '8px', height: '100%' }}>
                        <div style={{ marginBottom: '8px' }}>
                            <Text strong style={{ fontSize: '12px' }}>From : </Text>
                            <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>{businessName}</Text>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                            <Text strong style={{ fontSize: '12px' }}>Contact Number : </Text>
                            <Text style={{ fontSize: '14px' }}>{businessPhone}</Text>
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <Text strong style={{ fontSize: '12px' }}>Issued Date : </Text>
                            <Text style={{ fontSize: '14px' }}>{dayjs(order.created_at).format('YYYY-MM-DD')}</Text>
                        </div>
                    </div>
                </Col>
                <Col span={12}>
                    <div style={{ border: '2px solid black', padding: '10px', height: '100%' }}>
                        <Title level={4} style={{ textAlign: 'center', margin: '0 0 10px 0', borderBottom: '1px solid black' }}>PROOF OF DELIVERY</Title>
                        <div style={{ textAlign: 'center', padding: '5px' }}>
                            {/* Simple Barcode Replacement */}
                            <div style={{ border: '1px solid black', padding: '5px', display: 'inline-block' }}>
                                <Text style={{ display: 'block', letterSpacing: '4px', fontWeight: 'bold' }}>||||||||||||||||||||</Text>
                                <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>{order.id.substring(0, 8).toUpperCase()}</Text>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            <div style={{ border: '2px solid black', padding: '15px', marginBottom: '15px' }}>
                <Row align="middle">
                    <Col span={4}><Text strong style={{ fontSize: '16px' }}>To :</Text></Col>
                    <Col span={20}><Text style={{ fontSize: '28px', fontWeight: '900', textTransform: 'uppercase' }}>{order.customer_name}</Text></Col>
                </Row>
                <Row style={{ marginTop: '12px' }}>
                    <Col span={4}><Text strong style={{ fontSize: '16px' }}>Address :</Text></Col>
                    <Col span={20}>
                        <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>{order.delivery_address}</Text>
                    </Col>
                </Row>
                <Row style={{ marginTop: '20px' }} gutter={10}>
                    <Col span={12}>
                        <Row align="middle">
                            <Col span={8}><Text strong style={{ fontSize: '14px' }}>District :</Text></Col>
                            <Col span={16}><Text style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '2px solid black', display: 'block' }}>{order.district}</Text></Col>
                        </Row>
                        <Row style={{ marginTop: '15px' }} align="middle">
                            <Col span={8}><Text strong style={{ fontSize: '14px' }}>City :</Text></Col>
                            <Col span={16}><Text style={{ fontSize: '18px', fontWeight: 'bold', borderBottom: '2px solid black', display: 'block' }}>{order.nearest_main_city}</Text></Col>
                        </Row>
                    </Col>
                    <Col span={12}>
                        <div style={{ border: '3px solid black', padding: '15px', marginLeft: '10px', backgroundColor: '#eeeeee', textAlign: 'center' }}>
                            <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '5px' }}>C O D   A M O U N T</Text>
                            <Text style={{ fontSize: '32px', fontWeight: '900' }}>Rs. {parseFloat(order.total_amount).toLocaleString()}/=</Text>
                        </div>
                    </Col>
                </Row>
            </div>

            <Row gutter={20}>
                <Col span={12}>
                    <div style={{ border: '2px solid black', padding: '12px', height: '100%' }}>
                        <div style={{ marginBottom: '8px' }}>
                            <Text strong style={{ fontSize: '14px' }}>Phone 01: </Text>
                            <Text style={{ fontSize: '22px', fontWeight: '900' }}>{order.phone_number}</Text>
                        </div>
                        <div>
                            <Text strong style={{ fontSize: '14px' }}>Phone 02: </Text>
                            <Text style={{ fontSize: '20px', fontWeight: 'bold' }}>{order.secondary_phone_number || 'N/A'}</Text>
                        </div>
                    </div>
                </Col>
                <Col span={12}>
                    <div style={{ border: '1px solid black', padding: '12px', height: '100%' }}>
                        <Text strong style={{ fontSize: '14px' }}>Description : </Text>
                        <Text style={{ fontSize: '16px', fontWeight: 'bold', display: 'block', marginTop: '5px' }}>Clothing Items</Text>
                        <Text style={{ fontSize: '12px' }}>Order Ref: #{order.id.substring(0, 8).toUpperCase()}</Text>
                    </div>
                </Col>
            </Row>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '10px' }}>
                <div>
                    <Text>____________________</Text><br />
                    <Text strong>Receiver's Signature</Text>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <Text italic>Generated via Madhuthisara System</Text>
                </div>
            </div>

            {/* Print & Screen Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .printable-wrapper {
                    display: none;
                }
                @media print {
                    @page {
                        size: A5 landscape;
                        margin: 0;
                    }
                    body * {
                        display: none !important;
                    }
                    .printable-wrapper, .printable-wrapper *, #printable-receipt, #printable-receipt * {
                        display: block !important;
                        visibility: visible !important;
                    }
                    .printable-wrapper {
                        display: block !important;
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        z-index: 9999;
                        background: white;
                    }
                    #printable-receipt { 
                        position: relative;
                        margin: 0;
                        width: 210mm;
                        height: 148mm;
                        border: none;
                    }
                }
            `}} />
        </div>
    );
};

export default DeliveryReceipt;
