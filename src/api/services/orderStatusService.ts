import axiosInstance from '../axiosInstance';
import { API_ENDPOINTS } from '../endpoints';
import { PaginatedData } from '../../types/pagination';

export interface OrderStatusData {
    id: string;
    business_id: string;
    name: string;
    color: string;
    created_at: string;
    updated_at: string;
}


export interface OrderStatusResponse {
    success: boolean;
    message: string;
    output: PaginatedData<OrderStatusData>;
}

export const orderStatusService = {
    getAll: async (businessId: string, page: number = 1, perPage: number = 15): Promise<OrderStatusResponse> => {
        const response = await axiosInstance.get(API_ENDPOINTS.ORDER_STATUSES.ALL, {
            params: { business_id: businessId, page, per_page: perPage },
        });
        return response.data;
    },

    create: async (data: { business_id: string; name: string; color?: string }) => {
        const response = await axiosInstance.post(API_ENDPOINTS.ORDER_STATUSES.CREATE, data);
        return response.data;
    },

    update: async (data: { id: string; name?: string; color?: string }) => {
        const response = await axiosInstance.put(API_ENDPOINTS.ORDER_STATUSES.UPDATE, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await axiosInstance.delete(API_ENDPOINTS.ORDER_STATUSES.DELETE, {
            params: { id },
        });
        return response.data;
    },
};
