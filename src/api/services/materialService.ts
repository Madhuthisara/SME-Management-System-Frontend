import axiosInstance from '../axiosInstance';
import { API_ENDPOINTS } from '../endpoints';
import { CreateMaterialPayload, UpdateMaterialPayload } from '../../types/material';

export const materialService = {
    getAllMaterials: async (businessId: string, page: number = 1, perPage: number = 100) => {
        const response = await axiosInstance.get(API_ENDPOINTS.MATERIALS.ALL, {
            params: { business_id: businessId, page, per_page: perPage }
        });
        return response.data.output || response.data.data;
    },

    createMaterial: async (data: CreateMaterialPayload) => {
        const response = await axiosInstance.post(API_ENDPOINTS.MATERIALS.CREATE, data);
        return response.data;
    },

    updateMaterial: async (data: UpdateMaterialPayload) => {
        const response = await axiosInstance.put(API_ENDPOINTS.MATERIALS.UPDATE, data);
        return response.data;
    },

    deleteMaterial: async (id: string) => {
        const response = await axiosInstance.delete(API_ENDPOINTS.MATERIALS.DELETE, {
            params: { id }
        });
        return response.data;
    }
};
