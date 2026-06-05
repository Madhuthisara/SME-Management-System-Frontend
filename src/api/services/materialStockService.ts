import axiosInstance from '../axiosInstance';
import { API_ENDPOINTS } from '../endpoints';

export const materialStockService = {
    getAllMaterialStocks: async (businessId: string, page: number = 1, perPage: number = 100) => {
        const response = await axiosInstance.get(API_ENDPOINTS.MATERIAL_STOCKS.ALL, {
            params: { business_id: businessId, page, per_page: perPage }
        });
        return response.data.output || response.data.data;
    },

    createMaterialStock: async (data: any) => {
        const response = await axiosInstance.post(API_ENDPOINTS.MATERIAL_STOCKS.CREATE, data);
        return response.data;
    },

    updateMaterialStock: async (data: any) => {
        const response = await axiosInstance.put(API_ENDPOINTS.MATERIAL_STOCKS.UPDATE, data);
        return response.data;
    },

    deleteMaterialStock: async (id: string) => {
        const response = await axiosInstance.delete(API_ENDPOINTS.MATERIAL_STOCKS.DELETE, {
            params: { id }
        });
        return response.data;
    }
};
