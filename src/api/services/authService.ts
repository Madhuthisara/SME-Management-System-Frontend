import axiosInstance from '../axiosInstance';
import { API_ENDPOINTS } from '../endpoints';
import { LoginPayload, RegisterPayload } from '../../types/auth';

export const authService = {
    login: async (payload: LoginPayload) => {
        const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, payload);
        return response.data;
    },

    register: async (payload: RegisterPayload) => {
        const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REGISTER, payload);
        return response.data;
    },
};
