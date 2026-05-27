import { AxiosRequestConfig } from 'axios';
import axiosInstance from '../axiosInstance';
import { API_ENDPOINTS } from '../endpoints';
import {
    MaterialStockResponse,
    MaterialStocksListResponse,
    CreateMaterialStockPayload,
    UpdateMaterialStockPayload
} from '../../types/materialStock';

export const materialStockService = {
    getAllMaterialStocks: async (businessId: string, page: number = 1, perPage: number = 15, config?: AxiosRequestConfig): Promise<MaterialStocksListResponse> => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.MATERIAL_STOCKS.ALL}?business_id=${businessId}&page=${page}&per_page=${perPage}`, config);
        return response.data;
    },

    createMaterialStock: async (payload: CreateMaterialStockPayload, config?: AxiosRequestConfig): Promise<MaterialStockResponse> => {
        const response = await axiosInstance.post(API_ENDPOINTS.MATERIAL_STOCKS.CREATE, payload, config);
        return response.data;
    },

    updateMaterialStock: async (payload: UpdateMaterialStockPayload, config?: AxiosRequestConfig): Promise<MaterialStockResponse> => {
        const response = await axiosInstance.put(API_ENDPOINTS.MATERIAL_STOCKS.UPDATE, payload, config);
        return response.data;
    },

    deleteMaterialStock: async (stockId: string, config?: AxiosRequestConfig): Promise<{ success: boolean; message: string; output: any[] }> => {
        const response = await axiosInstance.delete(`${API_ENDPOINTS.MATERIAL_STOCKS.DELETE}?stock_id=${stockId}`, config);
        return response.data;
    },
};
