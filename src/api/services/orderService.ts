import { AxiosRequestConfig } from 'axios';
import axiosInstance from '../axiosInstance';
import { API_ENDPOINTS } from '../endpoints';
import {
    OrdersListResponse,
    OrderResponse,
    CreateOrderPayload,
    UpdateOrderStatusPayload
} from '../../types/order';

export const orderService = {
    getAllOrders: async (businessId: string, page: number = 1, perPage: number = 15, config?: AxiosRequestConfig): Promise<OrdersListResponse> => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.ORDERS.ALL}?business_id=${businessId}&page=${page}&per_page=${perPage}`, config);
        return response.data;
    },

    getOrderById: async (id: string, config?: AxiosRequestConfig): Promise<OrderResponse> => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.ORDERS.GET_ONE}?id=${id}`, config);
        return response.data;
    },

    createOrder: async (payload: CreateOrderPayload, config?: AxiosRequestConfig): Promise<OrderResponse> => {
        const response = await axiosInstance.post(API_ENDPOINTS.ORDERS.CREATE, payload, config);
        return response.data;
    },

    updateOrderStatus: async (id: string, payload: UpdateOrderStatusPayload, config?: AxiosRequestConfig): Promise<OrderResponse> => {
        const response = await axiosInstance.put(`${API_ENDPOINTS.ORDERS.UPDATE_STATUS}?id=${id}`, payload, config);
        return response.data;
    },

    deleteOrder: async (id: string, config?: AxiosRequestConfig): Promise<{ success: boolean; message: string }> => {
        const response = await axiosInstance.delete(`${API_ENDPOINTS.ORDERS.DELETE}?id=${id}`, config);
        return response.data;
    },
};
