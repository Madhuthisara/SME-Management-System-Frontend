import axios from 'axios';
import { message } from 'antd';

// Set up axios with base URL and default headers
const baseURL = process.env.REACT_APP_API_URL ||
    process.env.VITE_API_BASE_URL ||
    'https://api.ragingfire.itsnuve.co/api';

const axiosInstance = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // 'ngrok-skip-browser-warning': 'true',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token && token !== 'null' && token !== 'undefined' && token !== 'true' && token !== 'false') {
            config.headers.Authorization = `Bearer ${token}`;
            console.log(`[Axios] Added valid JWT token to request: ${config.url}`);
        } else {
            if (!config.withCredentials) {
                console.warn(`[Axios] No valid JWT token found for request: ${config.url}. Current token value:`, token);
            }
        }

        // Use correct content type for file uploads
        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle API responses and errors
axiosInstance.interceptors.response.use(
    (response) => {
        const config = response.config as any;
        if (config._showSuccessMessage && response.data && response.data.message) {
            message.success(response.data.message);
        }
        return response;
    },
    (error) => {
        if (axios.isCancel(error)) {
            return Promise.reject(error);
        }

        const { response, config } = error;
        const customConfig = config as any;

        if (response) {
            if (customConfig._showErrorMessage !== false) {
                const errorMessage = response.data?.message || 'Something went wrong';
                message.error(errorMessage);
            }

            if (response.status === 401) {
                console.error("Unauthorized request (401) to:", config.url);

                if (config.url?.includes('api/auth/login') || config.url?.endsWith('/login')) {
                    console.log("401 came from login endpoint itself, skipping redirect loop.");
                    return Promise.reject(error);
                }
                console.log("Clearing localStorage due to 401. Current Token was:", localStorage.getItem('token'));

                localStorage.removeItem('token');
                localStorage.removeItem('user');

                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        } else {
            const isAborted = error.code === 'ERR_CANCELED' || error.name === 'CanceledError';

            if (customConfig?._showErrorMessage !== false && !isAborted) {
                if (error.message === 'Network Error') {
                    message.error('Network error / CORS block. Please check if the server is running and CORS is configured correctly.');
                } else {
                    message.error('Network error. Please check your connection.');
                }
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;