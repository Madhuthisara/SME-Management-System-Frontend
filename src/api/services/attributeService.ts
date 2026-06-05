import axiosInstance from '../axiosInstance';
import { API_ENDPOINTS } from '../endpoints';
import { Attribute, CreateAttributePayload, UpdateAttributePayload, AttributeOption, CreateAttributeOptionPayload, UpdateAttributeOptionPayload } from '../../types/attribute';

export const attributeService = {
    getAllAttributes: async (businessId: string, page: number = 1, perPage: number = 100): Promise<any> => {
        const response = await axiosInstance.get(API_ENDPOINTS.ATTRIBUTES.ALL, {
            params: { business_id: businessId, page, per_page: perPage }
        });
        return response.data.output || response.data.data;
    },

    createAttribute: async (data: CreateAttributePayload): Promise<Attribute> => {
        const response = await axiosInstance.post(API_ENDPOINTS.ATTRIBUTES.CREATE, data);
        return response.data.output || response.data.data;
    },

    updateAttribute: async (data: UpdateAttributePayload): Promise<Attribute> => {
        const response = await axiosInstance.put(API_ENDPOINTS.ATTRIBUTES.UPDATE + `?id=${data.attribute_id}`, data);
        return response.data.output || response.data.data;
    },

    deleteAttribute: async (id: string): Promise<any> => {
        const response = await axiosInstance.delete(API_ENDPOINTS.ATTRIBUTES.DELETE, {
            params: { id }
        });
        return response.data;
    },

    // OPTIONS
    getAllOptions: async (attributeId: string, page: number = 1, perPage: number = 100): Promise<any> => {
        const response = await axiosInstance.get(API_ENDPOINTS.ATTRIBUTES.OPTIONS.ALL, {
            params: { attribute_id: attributeId, page, per_page: perPage }
        });
        return response.data.output || response.data.data;
    },

    createOption: async (data: CreateAttributeOptionPayload): Promise<AttributeOption> => {
        const response = await axiosInstance.post(API_ENDPOINTS.ATTRIBUTES.OPTIONS.CREATE, data);
        return response.data.output || response.data.data;
    },

    updateOption: async (data: UpdateAttributeOptionPayload): Promise<AttributeOption> => {
        const response = await axiosInstance.put(API_ENDPOINTS.ATTRIBUTES.OPTIONS.UPDATE + `?id=${data.option_id}`, data);
        return response.data.output || response.data.data;
    },

    deleteOption: async (id: string): Promise<any> => {
        const response = await axiosInstance.delete(API_ENDPOINTS.ATTRIBUTES.OPTIONS.DELETE, {
            params: { id }
        });
        return response.data;
    }
};
