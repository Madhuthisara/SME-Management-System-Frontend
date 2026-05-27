import axios from 'axios';
import { message } from 'antd';

// Set up axios with base URL and default headers
const baseURL = process.env.REACT_APP_API_URL || process.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    },
});

// Add token to every request if it exists
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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
        // Show success message if requested
        if (config._showSuccessMessage && response.data && response.data.message) {
            message.success(response.data.message);
        }
        return response;
    },
    (error) => {
        // Don't show error if the request was cancelled
        if (axios.isCancel(error)) {
            return Promise.reject(error);
        }

        const { response, config } = error;
        const customConfig = config as any;

        if (response) {
            // Show error message from API unless disabled
            if (customConfig._showErrorMessage !== false) {
                const errorMessage = response.data?.message || 'Something went wrong';
                message.error(errorMessage);
            }

            // If unauthorized, clear session and go to login
            if (response.status === 401) {
                console.error("Unauthorized request (401) to:", config.url);
                console.log("Clearing localStorage and redirecting to login...");

                localStorage.removeItem('token');
                localStorage.removeItem('user');

                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        } else {
            // Handle network connection issues
            const isAborted = error.code === 'ERR_CANCELED' || error.name === 'CanceledError';

            if (customConfig?._showErrorMessage !== false && !isAborted) {
                message.error('Network error. Please check your connection.');
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
