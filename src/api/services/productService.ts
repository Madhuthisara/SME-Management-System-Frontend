import axiosInstance from '../axiosInstance';
import { API_ENDPOINTS } from '../endpoints';

export const productService = {
    getAllProducts: async (businessId: string, page: number = 1, perPage: number = 100) => {
        const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.ALL, {
            params: { business_id: businessId, page, per_page: perPage }
        });
        return response.data.output || response.data.data;
    },

    createProduct: async (data: any) => {
        const response = await axiosInstance.post(API_ENDPOINTS.PRODUCTS.CREATE, data);
        return response.data;
    },

    updateProduct: async (id: string, data: any) => {
        const response = await axiosInstance.put(API_ENDPOINTS.PRODUCTS.UPDATE, data, {
            params: { id }
        });
        return response.data;
    },

    deleteProduct: async (id: string) => {
        const response = await axiosInstance.delete(API_ENDPOINTS.PRODUCTS.DELETE, {
            params: { id }
        });
        return response.data;
    },

    getProductVariants: async (id: string) => {
        const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.VARIANTS(id));
        return response.data.output || response.data.data;
    },

    getRequiredAttributes: async (id: string) => {
        const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.REQUIRED_ATTRIBUTES(id));
        return response.data.output || response.data.data;
    },

    uploadImage: async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        try {
            const response = await axiosInstance.post(API_ENDPOINTS.MEDIA.UPLOAD, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return {
                success: true,
                url: response.data.url || response.data.data?.url || response.data.output?.url,
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to upload image',
            };
        }
    }
};
