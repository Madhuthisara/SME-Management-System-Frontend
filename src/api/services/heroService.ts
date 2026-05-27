import axiosInstance from "../axiosInstance";
import { PaginatedData } from "../../types/pagination";
import { API_ENDPOINTS } from "../endpoints";

export interface HeroSection {
    id: number;
    title: string | null;
    description: string | null;
    image_path: string;
    button_text: string | null;
    button_link: string | null;
    order: number;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export type HeroSectionInput = Omit<HeroSection, 'id' | 'created_at' | 'updated_at'>;

export const heroService = {
    getAllHeroes: async (page: number = 1, perPage: number = 15): Promise<PaginatedData<HeroSection>> => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.HEROES.ALL}?page=${page}&per_page=${perPage}`);
        return response.data.data;
    },

    createHero: async (data: HeroSectionInput): Promise<HeroSection> => {
        const response = await axiosInstance.post(API_ENDPOINTS.HEROES.CREATE, data);
        return response.data.data;
    },

    updateHero: async (id: number | string, data: Partial<HeroSectionInput>): Promise<HeroSection> => {
        const response = await axiosInstance.put(API_ENDPOINTS.HEROES.UPDATE(id), data);
        return response.data.data;
    },

    deleteHero: async (id: number | string): Promise<void> => {
        const response = await axiosInstance.delete(API_ENDPOINTS.HEROES.DELETE(id));
        return response.data;
    },

    uploadImage: async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await axiosInstance.post(API_ENDPOINTS.MEDIA.UPLOAD, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.url;
    }
};
