import axiosInstance from "../axiosInstance";
import { API_ENDPOINTS } from "../endpoints";

export interface DashboardStats {
    summary: {
        total_orders: number;
        total_revenue: number;
        total_products: number;
        low_stock_materials: number;
    };
    recent_orders: Array<{
        id: string;
        customer_name: string;
        total_amount: number;
        status: string;
        created_at: string;
    }>;
    chart_data: Array<{
        date: string;
        revenue: number;
    }>;
}

export const dashboardService = {
    getStats: async (): Promise<DashboardStats> => {
        const response = await axiosInstance.get(API_ENDPOINTS.DASHBOARD.STATS);
        return response.data.data;
    },
};
