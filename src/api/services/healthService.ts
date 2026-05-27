import axiosInstance from '../axiosInstance';
import { API_ENDPOINTS } from '../endpoints';
import { HealthStatusResponse } from '../../types/health';

export const healthService = {
    getHealthStatus: async (): Promise<HealthStatusResponse> => {
        const response = await axiosInstance.get(API_ENDPOINTS.HEALTH, {
            // @ts-ignore - custom property for interceptor
            _showErrorMessage: false
        });
        return response.data;
    },
};
