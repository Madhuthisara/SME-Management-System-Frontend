import React from 'react';
import { Modal, message } from 'antd';
import OrderForm from './OrderForm';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../api/services/productService';
import { orderService } from '../../api/services/orderService';
import { orderStatusService } from '../../api/services/orderStatusService';
import { getLocalStorageData } from '../../utils/storage';
import { CreateOrderPayload } from '../../types/order';

interface AddOrderModalProps {
    open: boolean;
    onClose: () => void;
}

const AddOrderModal: React.FC<AddOrderModalProps> = ({ open, onClose }) => {
    const queryClient = useQueryClient();
    const user = getLocalStorageData<any>('user') || {};
    const businessId = user.business_id;

    const { data: productsData, isLoading: productsLoading } = useQuery({
        queryKey: ['products', businessId],
        queryFn: () => productService.getAllProducts(businessId),
        enabled: !!businessId && open,
    });

    const { data: statusesData } = useQuery({
        queryKey: ['order-statuses', businessId],
        queryFn: () => orderStatusService.getAll(businessId),
        enabled: !!businessId && open,
    });

    const createOrderMutation = useMutation({
        mutationFn: (payload: CreateOrderPayload) => orderService.createOrder(payload),
        onSuccess: () => {
            message.success('Order created successfully!');
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            onClose();
        },
        onError: (error: any) => {
            message.error(error.response?.data?.message || 'Failed to create order');
        },
    });

    const handleSubmit = (values: CreateOrderPayload) => {
        createOrderMutation.mutate({ ...values, business_id: businessId } as any);
    };


    return (
        <Modal
            title="Add New Order"
            open={open}
            onCancel={onClose}
            footer={null}
            width={700}
            destroyOnHidden
            style={{ top: 20 }}
        >
            <OrderForm
                products={productsData?.output?.values || []}
                orderStatuses={statusesData?.output?.values || []}
                onSubmit={handleSubmit}
                loading={createOrderMutation.isPending || productsLoading}
            />
        </Modal>
    );
};

export default AddOrderModal;
