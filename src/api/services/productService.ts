import { AxiosRequestConfig } from 'axios';
import axiosInstance from '../axiosInstance';
import { API_ENDPOINTS } from '../endpoints';
import {
    ProductsListResponse,
    ProductResponse,
    CreateProductPayload,
    UpdateProductPayload
} from '../../types/product';

export const productService = {
    getAllProducts: async (businessId: string, page: number = 1, perPage: number = 15, config?: AxiosRequestConfig): Promise<ProductsListResponse> => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.PRODUCTS.ALL}?business_id=${businessId}&page=${page}&per_page=${perPage}`, config);
        return response.data;
    },

    uploadImage: async (file: File, config?: AxiosRequestConfig): Promise<{ success: boolean; url: string; message: string }> => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await axiosInstance.post('/media/upload', formData, {
            ...config,
            headers: {
                ...config?.headers,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    createProduct: async (payload: CreateProductPayload, config?: AxiosRequestConfig): Promise<ProductResponse> => {
        const response = await axiosInstance.post(API_ENDPOINTS.PRODUCTS.CREATE, payload, config);
        return response.data;
    },

    updateProduct: async (id: string, payload: UpdateProductPayload, config?: AxiosRequestConfig): Promise<ProductResponse> => {
        const response = await axiosInstance.put(`${API_ENDPOINTS.PRODUCTS.UPDATE}?id=${id}`, payload, config);
        return response.data;
    },

    deleteProduct: async (id: string, config?: AxiosRequestConfig): Promise<{ success: boolean; message: string }> => {
        const response = await axiosInstance.delete(`${API_ENDPOINTS.PRODUCTS.DELETE}?id=${id}`, config);
        return response.data;
    },

    getVariants: async (id: string, config?: AxiosRequestConfig): Promise<{ success: boolean; output: any[] }> => {
        const response = await axiosInstance.get((API_ENDPOINTS.PRODUCTS.VARIANTS as any)(id), config);
        return response.data;
    },

    getRequiredAttributes: async (id: string, config?: AxiosRequestConfig): Promise<{ success: boolean; output: any[] }> => {
        const response = await axiosInstance.get((API_ENDPOINTS.PRODUCTS.REQUIRED_ATTRIBUTES as any)(id), config);
        return response.data;
    },
};
