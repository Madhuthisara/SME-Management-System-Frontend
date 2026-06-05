import axiosInstance from "../axiosInstance";
import { API_ENDPOINTS } from "../endpoints";

export const categoryService = {
    getAllCategories: async (businessId: string, page: number = 1, perPage: number = 15) => {
        const response = await axiosInstance.get(API_ENDPOINTS.CATEGORIES.ALL, {
            params: { business_id: businessId, page, per_page: perPage }
        });
        return response.data.output || response.data.data;
    },

    createCategory: async (data: { business_id: string; name: string }) => {
        const response = await axiosInstance.post(API_ENDPOINTS.CATEGORIES.CREATE, data);
        return response.data.output || response.data.data;
    },

    updateCategory: async (data: { id: string; name: string }) => {
        const response = await axiosInstance.put(API_ENDPOINTS.CATEGORIES.UPDATE, data);
        return response.data.output || response.data.data;
    },

    deleteCategory: async (id: string) => {
        const response = await axiosInstance.delete(API_ENDPOINTS.CATEGORIES.DELETE, {
            params: { id }
        });
        return response.data;
    }
};
