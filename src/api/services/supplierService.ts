import axiosInstance from '../axiosInstance';
import { Supplier, CreateSupplierPayload, UpdateSupplierPayload } from '../../types/supplier';
import { PaginatedData } from '../../types/pagination';
import { AxiosRequestConfig } from 'axios';

export interface SupplierResponse {
    success: boolean;
    message: string;
    output: Supplier;
}

export interface SuppliersListResponse {
    success: boolean;
    message: string;
    output: PaginatedData<Supplier>;
}

export const supplierService = {
    getAllSuppliers: async (businessId: string, page: number = 1, perPage: number = 15, config?: AxiosRequestConfig): Promise<SuppliersListResponse> => {
        const response = await axiosInstance.get(`/suppliers/all?business_id=${businessId}&page=${page}&per_page=${perPage}`, config);
        return response.data;
    },

    createSupplier: async (payload: CreateSupplierPayload, config?: AxiosRequestConfig): Promise<SupplierResponse> => {
        const response = await axiosInstance.post('/suppliers/create', payload, config);
        return response.data;
    },

    updateSupplier: async (payload: UpdateSupplierPayload, config?: AxiosRequestConfig): Promise<SupplierResponse> => {
        const response = await axiosInstance.put(`/suppliers/update?id=${payload.id}`, payload, config);
        return response.data;
    },

    deleteSupplier: async (supplierId: string, config?: AxiosRequestConfig): Promise<{ success: boolean; message: string; output: any[] }> => {
        const response = await axiosInstance.delete(`/suppliers/delete?id=${supplierId}`, config);
        return response.data;
    }
};
