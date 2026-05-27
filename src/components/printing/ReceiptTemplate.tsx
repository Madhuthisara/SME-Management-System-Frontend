import React from 'react';
import { Typography } from 'antd';
import dayjs from 'dayjs';
import { Order } from '../../types/order';

const { Text } = Typography;

interface ReceiptTemplateProps {
    order: Order;
}

const ReceiptTemplate: React.FC<ReceiptTemplateProps> = ({ order }) => {
    return (
        <div className="bg-white p-6 border-4 border-black font-mono w-[210mm] h-[148mm] flex flex-col justify-between" style={{ boxSizing: 'border-box' }}>
            {/* Header */}
            <div className="flex justify-between items-start border-b-4 border-black pb-4 mb-4">
                <div>
                    <div className="text-4xl font-black tracking-widest uppercase italic leading-none">Koombiyo</div>
                    <div className="text-sm font-bold tracking-[0.3em] uppercase mt-1">D E L I V E R Y</div>
                    <div className="text-[10px] font-bold uppercase mt-1">Your Delivery Partner</div>
                </div>
                <div className="text-right text-[10px] leading-tight font-bold">
                    <div>No. 25, Epitamulla Road, Pita Kotte</div>
                    <div>Tel: +94 117 886 786 | Web: koombiyodelivery.lk</div>
                </div>
            </div>

            {/* Info Row */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="border border-black p-2 h-full">
                    <div className="flex mb-1"><Text className="text-[11px] font-bold w-20">From : </Text><Text className="text-[14px] font-black uppercase">Raging Fire Apparel</Text></div>
                    <div className="flex mb-1"><Text className="text-[11px] font-bold w-20">Contact : </Text><Text className="text-[14px] font-black">0701951000</Text></div>
                    <div className="flex"><Text className="text-[11px] font-bold w-20">Date : </Text><Text className="text-[14px] font-black">{dayjs(order.created_at).format('YYYY-MM-DD')}</Text></div>
                </div>
                <div className="border-4 border-black p-2 text-center flex flex-col justify-center items-center bg-gray-50">
                    <div className="text-[12px] font-black border-b border-black w-full pb-1 mb-2 uppercase tracking-widest">Proof of Delivery</div>
                    <div className="font-bold text-2xl tracking-tighter">||||||||||||||||||||||||</div>
                    <div className="text-lg font-black mt-1 uppercase">#{order.id.substring(0, 8)}</div>
                </div>
            </div>

            {/* Customer Section */}
            <div className="border-4 border-black p-4 mb-4 flex-grow">
                <div className="flex items-center mb-2">
                    <Text className="text-[14px] font-bold w-24">TO :</Text>
                    <Text className="text-3xl font-black uppercase leading-none">{order.customer_name}</Text>
                </div>
                <div className="flex items-start mb-4">
                    <Text className="text-[14px] font-bold w-24">ADDRESS :</Text>
                    <Text className="text-xl font-bold leading-tight flex-1">{order.delivery_address}</Text>
                </div>

                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <div className="flex items-center border-b-2 border-black mb-2 pb-1">
                            <Text className="text-[12px] font-bold w-24">DISTRICT :</Text>
                            <Text className="text-xl font-black">{order.district || 'N/A'}</Text>
                        </div>
                        <div className="flex items-center border-b-2 border-black pb-1">
                            <Text className="text-[12px] font-bold w-24">CITY :</Text>
                            <Text className="text-xl font-black">{order.nearest_main_city || 'N/A'}</Text>
                        </div>
                    </div>
                    <div className="border-[5px] border-black p-3 bg-gray-200 text-center min-w-[220px]">
                        <div className="text-xs font-black tracking-[0.2em] mb-1 uppercase">C O D Amount</div>
                        <div className="text-4xl font-black">Rs. {parseFloat(order.total_amount).toLocaleString()}/=</div>
                    </div>
                </div>
            </div>

            {/* Footer Rows */}
            <div className="grid grid-cols-2 gap-4">
                <div className="border-4 border-black p-2">
                    <div className="flex items-center mb-1"><Text className="text-[12px] font-bold w-24">PHONE 01 :</Text><Text className="text-xl font-black">{order.phone_number}</Text></div>
                    <div className="flex items-center"><Text className="text-[12px] font-bold w-24">PHONE 02 :</Text><Text className="text-xl font-black">{order.secondary_phone_number || 'N/A'}</Text></div>
                </div>
                <div className="border border-black p-2 bg-gray-50">
                    <Text className="text-[11px] font-bold block mb-1">DESCRIPTION :</Text>
                    <Text className="text-[14px] font-black block">Clothing Items - {order.notes || 'No notes'}</Text>
                    <Text className="text-[10px] mt-1 block">Ref: #{order.id.substring(0, 8).toUpperCase()}</Text>
                </div>
            </div>

            {/* Signature */}
            <div className="flex justify-between items-end mt-4">
                <div>
                    <div className="w-48 border-b-2 border-black italic mb-1"></div>
                    <Text className="text-[10px] font-bold uppercase">Receiver's Signature</Text>
                </div>
                <Text className="text-[10px] italic">Generated via Madhuthisara System</Text>
            </div>
        </div>
    );
};

export default ReceiptTemplate;
