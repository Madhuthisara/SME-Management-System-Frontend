import { AxiosRequestConfig } from 'axios';
import axiosInstance from '../axiosInstance';
import { API_ENDPOINTS } from '../endpoints';
import {
    ProfileResponse,
    UpdatePersonalPayload,
    UpdateCompanyPayload,
    ChangePasswordPayload
} from '../../types/profile';

export const profileService = {
    getProfile: async (config?: AxiosRequestConfig): Promise<ProfileResponse> => {
        const response = await axiosInstance.get(API_ENDPOINTS.PROFILE.GET, config);
        return response.data;
    },

    updatePersonal: async (payload: UpdatePersonalPayload, config?: AxiosRequestConfig) => {
        const response = await axiosInstance.put(API_ENDPOINTS.PROFILE.UPDATE_PERSONAL, payload, config);
        return response.data;
    },

    updateCompany: async (payload: UpdateCompanyPayload, config?: AxiosRequestConfig) => {
        const response = await axiosInstance.put(API_ENDPOINTS.PROFILE.UPDATE_COMPANY, payload, config);
        return response.data;
    },

    changePassword: async (payload: ChangePasswordPayload, config?: AxiosRequestConfig) => {
        const response = await axiosInstance.put(API_ENDPOINTS.PROFILE.CHANGE_PASSWORD, payload, config);
        return response.data;
    },
};
