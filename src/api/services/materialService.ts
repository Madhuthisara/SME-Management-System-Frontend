import { AxiosRequestConfig } from 'axios';
import axiosInstance from '../axiosInstance';
import { API_ENDPOINTS } from '../endpoints';
import {
    MaterialResponse,
    MaterialsListResponse,
    CreateMaterialPayload,
    UpdateMaterialPayload
} from '../../types/material';

export const materialService = {
    getAllMaterials: async (businessId: string, page: number = 1, perPage: number = 15, config?: AxiosRequestConfig): Promise<MaterialsListResponse> => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.MATERIALS.ALL}?business_id=${businessId}&page=${page}&per_page=${perPage}`, config);
        return response.data;
    },

    createMaterial: async (payload: CreateMaterialPayload, config?: AxiosRequestConfig): Promise<MaterialResponse> => {
        const response = await axiosInstance.post(API_ENDPOINTS.MATERIALS.CREATE, payload, config);
        return response.data;
    },

    updateMaterial: async (payload: UpdateMaterialPayload, config?: AxiosRequestConfig): Promise<MaterialResponse> => {
        const response = await axiosInstance.put(API_ENDPOINTS.MATERIALS.UPDATE, payload, config);
        return response.data;
    },

    deleteMaterial: async (id: string, config?: AxiosRequestConfig): Promise<{ success: boolean; message: string; output: any[] }> => {
        const response = await axiosInstance.delete(`${API_ENDPOINTS.MATERIALS.DELETE}?id=${id}`, config);
        return response.data;
    },
};
