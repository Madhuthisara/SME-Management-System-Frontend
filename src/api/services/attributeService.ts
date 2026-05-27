import { AxiosRequestConfig } from 'axios';
import axiosInstance from '../axiosInstance';
import { API_ENDPOINTS } from '../endpoints';
import {
    AttributeResponse,
    AttributesListResponse,
    CreateAttributePayload,
    UpdateAttributePayload,
    AttributeOptionResponse,
    AttributeOptionsListResponse,
    CreateAttributeOptionPayload,
    UpdateAttributeOptionPayload
} from '../../types/attribute';

export const attributeService = {
    getAllAttributes: async (businessId: string, page: number = 1, perPage: number = 15, config?: AxiosRequestConfig): Promise<AttributesListResponse> => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.ATTRIBUTES.ALL}?business_id=${businessId}&page=${page}&per_page=${perPage}`, config);
        return response.data;
    },

    createAttribute: async (payload: CreateAttributePayload, config?: AxiosRequestConfig): Promise<AttributeResponse> => {
        const response = await axiosInstance.post(API_ENDPOINTS.ATTRIBUTES.CREATE, payload, config);
        return response.data;
    },

    updateAttribute: async (payload: UpdateAttributePayload, config?: AxiosRequestConfig): Promise<AttributeResponse> => {
        const response = await axiosInstance.put(API_ENDPOINTS.ATTRIBUTES.UPDATE, payload, config);
        return response.data;
    },

    deleteAttribute: async (id: string, config?: AxiosRequestConfig): Promise<{ success: boolean; message: string; output: any[] }> => {
        const response = await axiosInstance.delete(`${API_ENDPOINTS.ATTRIBUTES.DELETE}?id=${id}`, config);
        return response.data;
    },

    getAllOptions: async (attributeId: string, page: number = 1, perPage: number = 15, config?: AxiosRequestConfig): Promise<AttributeOptionsListResponse> => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.ATTRIBUTES.OPTIONS.ALL}?attribute_id=${attributeId}&page=${page}&per_page=${perPage}`, config);
        return response.data;
    },

    createOption: async (payload: CreateAttributeOptionPayload, config?: AxiosRequestConfig): Promise<AttributeOptionResponse> => {
        const response = await axiosInstance.post(API_ENDPOINTS.ATTRIBUTES.OPTIONS.CREATE, payload, config);
        return response.data;
    },

    updateOption: async (payload: UpdateAttributeOptionPayload, config?: AxiosRequestConfig): Promise<AttributeOptionResponse> => {
        const response = await axiosInstance.put(API_ENDPOINTS.ATTRIBUTES.OPTIONS.UPDATE, payload, config);
        return response.data;
    },

    deleteOption: async (id: string, config?: AxiosRequestConfig): Promise<{ success: boolean; message: string; output: any[] }> => {
        const response = await axiosInstance.delete(`${API_ENDPOINTS.ATTRIBUTES.OPTIONS.DELETE}?id=${id}`, config);
        return response.data;
    },
};
