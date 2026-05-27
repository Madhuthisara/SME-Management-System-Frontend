import React from 'react';
import { Space, Typography, Divider } from 'antd';
import dayjs from 'dayjs';
import { Order } from '../../types/order';

const { Title, Text } = Typography;

interface InvoiceTemplateProps {
    order: Order;
}

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ order }) => {
    const subtotal = order.items?.reduce((sum: number, item: any) => sum + parseFloat(item.total_price), 0) || 0;
    const shipping = 400; // Hardcoded as per original logic
    const total = parseFloat(order.total_amount);

    return (
        <div className="bg-white p-12 w-[210mm] min-h-[297mm] mx-auto text-gray-800" style={{ boxSizing: 'border-box' }}>
            {/* Header */}
            <div className="flex justify-between items-start border-b-4 border-black pb-8 mb-10">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">Raging Fire</h1>
                    <div className="text-sm font-bold tracking-[0.4em] text-gray-500 mt-2">A P P A R E L</div>
                </div>
                <div className="text-right">
                    <h2 className="text-6xl font-light tracking-[0.2em] text-gray-200 leading-none">INVOICE</h2>
                    <div className="mt-4 space-y-1 text-sm font-semibold">
                        <div><Text className="text-gray-400">Invoice #:</Text> <span className="font-bold uppercase">INV-{order.id.substring(0, 8)}</span></div>
                        <div><Text className="text-gray-400">Date:</Text> <span className="font-bold">{dayjs(order.created_at).format('MMMM DD, YYYY')}</span></div>
                        <div className="mt-2"><span className="bg-gray-100 px-3 py-1 rounded text-xs font-black uppercase tracking-wider">{order.payment_method || 'COD'}</span></div>
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="grid grid-cols-2 gap-12 mb-12">
                <div>
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-4">Bill To</h4>
                    <div className="space-y-1">
                        <div className="text-2xl font-black uppercase">{order.customer_name}</div>
                        <div className="text-lg font-medium text-gray-600 leading-tight">{order.delivery_address}</div>
                        <div className="text-lg font-bold text-gray-800 uppercase tracking-wide">{order.nearest_main_city}, {order.district}</div>
                        <div className="pt-2 text-sm font-bold">
                            <span className="text-gray-400">Phone:</span> {order.phone_number}
                            {order.secondary_phone_number && <span className="ml-4"><span className="text-gray-400">Alt:</span> {order.secondary_phone_number}</span>}
                        </div>
                    </div>
                </div>
                <div className="text-right flex flex-col justify-end">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-4">Order Info</h4>
                    <div className="space-y-1 text-sm font-bold">
                        <div><span className="text-gray-400 uppercase tracking-tighter mr-2">Ref ID:</span> #{order.id.substring(0, 8).toUpperCase()}</div>
                        <div><span className="text-gray-400 uppercase tracking-tighter mr-2">Source:</span> <span className="uppercase">{order.source}</span></div>
                        <div className="pt-2"><span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white ${order.status === 'delivered' ? 'bg-green-500' : 'bg-blue-500'}`}>{order.status}</span></div>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className="mb-10">
                <table className="w-100 w-full">
                    <thead>
                        <tr className="bg-black text-white text-[10px] uppercase tracking-widest font-black">
                            <th className="py-4 px-6 text-left w-12">#</th>
                            <th className="py-4 px-6 text-left">Item Description</th>
                            <th className="py-4 px-6 text-center w-24">Qty</th>
                            <th className="py-4 px-6 text-right w-32">Unit Price</th>
                            <th className="py-4 px-6 text-right w-32">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {order.items?.map((item: any, index: number) => (
                            <tr key={index}>
                                <td className="py-6 px-6 text-sm text-gray-400">{index + 1}</td>
                                <td className="py-6 px-6">
                                    <div className="text-lg font-black uppercase tracking-tight">{item.product?.name || 'Product'}</div>
                                    <div className="text-xs text-gray-400 mt-1 uppercase font-bold">
                                        {item.selected_attributes?.map((a: any) => `${a.attribute_name}: ${a.option_name}`).join(' | ') || '-'}
                                    </div>
                                </td>
                                <td className="py-6 px-6 text-center text-lg font-bold">{item.quantity}</td>
                                <td className="py-6 px-6 text-right text-lg font-bold text-gray-500">Rs. {parseFloat(item.unit_price).toLocaleString()}</td>
                                <td className="py-6 px-6 text-right text-xl font-black">Rs. {parseFloat(item.total_price).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals Section */}
            <div className="flex justify-end mb-12">
                <div className="w-80 space-y-3">
                    <div className="flex justify-between text-lg font-bold text-gray-400">
                        <span>Subtotal</span>
                        <span>Rs. {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-400">
                        <span>Shipping</span>
                        <span>Rs. {shipping.toLocaleString()}</span>
                    </div>
                    <div className="pt-4 border-t-4 border-black flex justify-between items-end">
                        <span className="text-xl font-black uppercase">Grand Total</span>
                        <span className="text-4xl font-black tracking-tighter">Rs. {total.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Notes Section */}
            {order.notes && (
                <div className="bg-gray-50 p-6 rounded-xl mb-12">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-2">Internal Notes</h4>
                    <p className="text-sm font-bold text-gray-700 italic">{order.notes}</p>
                </div>
            )}

            {/* Footer */}
            <div className="mt-auto pt-10 border-t border-gray-100 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
                <div>Thank you for your business</div>
                <div>Madhuthisara System</div>
            </div>
        </div>
    );
};

export default InvoiceTemplate;
